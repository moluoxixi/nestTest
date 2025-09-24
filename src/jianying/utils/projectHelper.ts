/**
 * 项目辅助工具类
 * 对应Python版本的ProjectHelper功能
 */

import * as path from 'path';
import * as fs from 'fs';

/**
 * 项目辅助工具类
 */
export class ProjectHelper {
  /**
   * 获取项目的物理根目录
   * @returns 项目根路径
   */
  public static getRootPhysicalPath(): string {
    // 在Node.js中，我们使用process.cwd()作为项目根路径
    return process.cwd();
  }

  /**
   * 获取相对于项目根目录的路径
   * @param relativePath 相对路径
   * @returns 完整路径
   */
  public static getPath(relativePath: string): string {
    return path.join(this.getRootPhysicalPath(), relativePath);
  }

  /**
   * 获取资源目录路径
   * @param resourceName 资源名称（可选）
   * @returns 资源路径
   */
  public static getResourcePath(resourceName?: string): string {
    const resPath = path.join(this.getRootPhysicalPath(), '.res');
    
    if (resourceName) {
      return path.join(resPath, resourceName);
    }
    
    return resPath;
  }

  /**
   * 确保目录存在
   * @param dirPath 目录路径
   */
  public static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 获取包信息
   * @returns 包信息对象
   */
  public static getPackageInfo(): any {
    try {
      const packageJsonPath = path.join(this.getRootPhysicalPath(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageContent = fs.readFileSync(packageJsonPath, 'utf-8');
        return JSON.parse(packageContent);
      }
    } catch (error) {
      console.warn('读取package.json失败:', error.message);
    }
    
    return {
      name: 'unknown',
      version: '0.0.0',
      description: '',
    };
  }

  /**
   * 获取项目名称
   * @returns 项目名称
   */
  public static getProjectName(): string {
    const packageInfo = this.getPackageInfo();
    return packageInfo.name || 'unknown-project';
  }

  /**
   * 获取项目版本
   * @returns 项目版本
   */
  public static getProjectVersion(): string {
    const packageInfo = this.getPackageInfo();
    return packageInfo.version || '0.0.0';
  }

  /**
   * 检查文件是否在项目目录内
   * @param filePath 文件路径
   * @returns 是否在项目目录内
   */
  public static isFileInProject(filePath: string): boolean {
    const rootPath = this.getRootPhysicalPath();
    const resolvedPath = path.resolve(filePath);
    const resolvedRoot = path.resolve(rootPath);
    
    return resolvedPath.startsWith(resolvedRoot);
  }

  /**
   * 获取相对于项目根目录的相对路径
   * @param absolutePath 绝对路径
   * @returns 相对路径
   */
  public static getRelativePath(absolutePath: string): string {
    const rootPath = this.getRootPhysicalPath();
    return path.relative(rootPath, absolutePath);
  }

  /**
   * 创建临时目录
   * @param prefix 目录前缀
   * @returns 临时目录路径
   */
  public static createTempDirectory(prefix = 'jianying-temp'): string {
    const tempDir = path.join(this.getRootPhysicalPath(), 'temp');
    this.ensureDirectoryExists(tempDir);
    
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const tempDirName = `${prefix}-${timestamp}-${randomSuffix}`;
    const fullTempPath = path.join(tempDir, tempDirName);
    
    this.ensureDirectoryExists(fullTempPath);
    return fullTempPath;
  }

  /**
   * 清理临时目录
   * @param tempPath 临时目录路径
   */
  public static cleanupTempDirectory(tempPath: string): void {
    try {
      if (fs.existsSync(tempPath) && tempPath.includes('temp')) {
        fs.rmSync(tempPath, { recursive: true, force: true });
      }
    } catch (error) {
      console.warn('清理临时目录失败:', error.message);
    }
  }

  /**
   * 获取环境信息
   * @returns 环境信息对象
   */
  public static getEnvironmentInfo(): {
    platform: string;
    nodeVersion: string;
    projectRoot: string;
    workingDirectory: string;
  } {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      projectRoot: this.getRootPhysicalPath(),
      workingDirectory: process.cwd(),
    };
  }
}
