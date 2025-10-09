// Vercel SDK integration for automated deployment
// Documentation: https://vercel.com/docs/rest-api
import { Vercel } from "@vercel/sdk";

interface VercelConfig {
  token: string;
  teamId?: string;
}

interface VercelDeployment {
  id: string;
  url: string;
  status: string;
  readyState: string;
  alias?: string[];
}

interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework: string;
  devCommand?: string;
  buildCommand?: string;
  outputDirectory?: string;
}

class VercelAPI {
  private vercel: Vercel;
  private config: VercelConfig;

  constructor(config: VercelConfig) {
    this.config = config;
    this.vercel = new Vercel({
      bearerToken: config.token,
    });
  }

  /**
   * Create a new project on Vercel
   * @param name - Project name
   * @param gitUrl - Git repository URL
   * @param framework - Framework preset (nextjs, react, etc.)
   * @returns Promise with project details
   */
  async createProject(
    name: string,
    gitUrl: string,
    framework: string = "nextjs"
  ): Promise<VercelProject> {
    const repoPath = gitUrl.replace("https://github.com/", "");

    const result = await this.vercel.projects.createProject({
      requestBody: {
        name,
        gitRepository: {
          type: "github",
          repo: repoPath,
        },
        framework: "nextjs" as const,
        buildCommand: "npm run build",
        devCommand: "npm run dev",
        outputDirectory: ".next",
        installCommand: "npm i -f",
      },
    });

    return {
      id: result.id!,
      name: result.name!,
      accountId: result.accountId!,
      framework: result.framework || framework,
      devCommand: result.devCommand || "npm run dev",
      buildCommand: result.buildCommand || "npm run build",
      outputDirectory: result.outputDirectory || ".next",
    };
  }

  /**
   * Create project and trigger deployment using official Vercel SDK
   * @param projectName - Name of the project
   * @param gitUrl - Git repository URL
   * @returns Promise with project and deployment info
   */
  async createProjectAndDeploy(
    projectName: string,
    gitUrl: string
  ): Promise<{
    project: VercelProject;
    deploymentUrl: string;
    deployment?: VercelDeployment;
  }> {
    // Create the project first
    const project = await this.createProject(projectName, gitUrl);

    // Wait for project setup to complete
    await new Promise((resolve) => setTimeout(resolve, 5000));

    let deployment: VercelDeployment | undefined;

    try {
      // Create deployment using the official SDK approach
      deployment = await this.createDeploymentFromGit(projectName, gitUrl);
    } catch (error) {
      // Vercel will auto-deploy from GitHub integration
    }

    // Return the expected deployment URL
    const deploymentUrl = `https://${projectName}.vercel.app`;

    const result: {
      project: VercelProject;
      deploymentUrl: string;
      deployment?: VercelDeployment;
    } = {
      project,
      deploymentUrl,
    };

    if (deployment) {
      result.deployment = deployment;
    }

    return result;
  }

  /**
   * Create a deployment directly from Git repository
   * @param projectName - Name of the project
   * @param gitUrl - Git repository URL
   * @returns Promise with deployment details
   */
  async createDeploymentFromGit(
    projectName: string,
    gitUrl: string
  ): Promise<VercelDeployment> {
    const repoPath = gitUrl.replace("https://github.com/", "");
    const [orgName, repoName] = repoPath.split("/");

    if (!orgName || !repoName) {
      throw new Error(`Invalid GitHub URL format: ${gitUrl}`);
    }

    console.log(
      `Creating Vercel deployment from GitHub: ${orgName}/${repoName}`
    );

    let deploymentResult;

    try {
      // Try with main branch first
      deploymentResult = await this.vercel.deployments.createDeployment({
        requestBody: {
          name: projectName,
          target: "production",
          gitSource: {
            type: "github",
            repo: repoName,
            ref: "main",
            org: orgName,
          },
        },
      });
    } catch (mainBranchError) {
      // If main branch fails, try master branch
      console.log("Main branch failed, trying master branch...");
      try {
        deploymentResult = await this.vercel.deployments.createDeployment({
          requestBody: {
            name: projectName,
            target: "production",
            gitSource: {
              type: "github",
              repo: repoName,
              ref: "master",
              org: orgName,
            },
          },
        });
      } catch (masterBranchError) {
        // If both fail, throw the original error
        throw mainBranchError;
      }
    }

    try {
      const result = deploymentResult;

      const deployment: VercelDeployment = {
        id: result.id!,
        url: result.url!,
        status: result.status || "QUEUED",
        readyState: result.readyState || "QUEUED",
      };

      if (result.alias) {
        deployment.alias = result.alias;
      }

      return deployment;
    } catch (error) {
      // Enhanced error handling for GitHub repository issues
      if (
        error instanceof Error &&
        error.message.includes("incorrect_git_source_info")
      ) {
        throw new Error(
          `GitHub repository ${orgName}/${repoName} is not ready for deployment. ` +
            "The repository may be empty, still being created, or the main branch doesn't exist. " +
            "Please ensure the repository has commits and try again."
        );
      }
      throw error;
    }
  }

  /**
   * Get project deployments using official SDK
   * @param projectId - Vercel project ID
   * @returns Promise with deployments list
   */
  async getProjectDeployments(projectId: string): Promise<any[]> {
    try {
      const result = await this.vercel.deployments.getDeployments({
        projectId: projectId,
        limit: 5,
      });
      return result.deployments || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get deployment status using official SDK
   * @param deploymentId - Deployment ID
   * @returns Promise with deployment status
   */
  async getDeploymentStatus(deploymentId: string): Promise<VercelDeployment> {
    try {
      const result = await this.vercel.deployments.getDeployment({
        idOrUrl: deploymentId,
        withGitRepoInfo: "true",
      });

      const deployment: VercelDeployment = {
        id: result.id!,
        url: result.url!,
        status: result.status || "UNKNOWN",
        readyState: result.readyState || "UNKNOWN",
      };

      if (result.alias) {
        deployment.alias = result.alias;
      }

      return deployment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign an alias to a deployment
   * @param deploymentId - Deployment ID
   * @param aliasName - Alias name (e.g., "my-project.vercel.app")
   * @returns Promise with alias details
   */
  async assignAlias(
    deploymentId: string,
    aliasName: string
  ): Promise<{ alias: string }> {
    try {
      const result = await this.vercel.aliases.assignAlias({
        id: deploymentId,
        requestBody: {
          alias: aliasName,
          redirect: null,
        },
      });

      return {
        alias: result.alias || aliasName,
      };
    } catch (error) {
      console.warn(`Failed to assign alias ${aliasName}:`, error);
      throw error;
    }
  }
}

// Export the class and types
export {
  VercelAPI,
  type VercelConfig,
  type VercelDeployment,
  type VercelProject,
};

// Create and export a singleton instance if environment variables are available
let vercelInstance: VercelAPI | null = null;

export function getVercelInstance(): VercelAPI {
  if (!vercelInstance) {
    const config: VercelConfig = {
      token: process.env.VERCEL_TOKEN || "",
    };

    if (process.env.VERCEL_TEAM_ID) {
      config.teamId = process.env.VERCEL_TEAM_ID;
    }

    // Validate required config
    if (!config.token) {
      throw new Error(
        "Missing required Vercel API configuration. Please set VERCEL_TOKEN environment variable."
      );
    }

    vercelInstance = new VercelAPI(config);
  }

  return vercelInstance;
}
