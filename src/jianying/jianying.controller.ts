/**
 * 剪映草稿控制器
 * 提供剪映草稿相关的REST API接口
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JianyingService } from './jianying.service';
import { Draft } from './core/draft';
import {
  CreateDraftParamsType,
  AddMediaParamsType,
  AddTextParamsType,
  AddEffectParamsType,
  GenerateTransitionDataParamsType,
  GenerateAnimationDataParamsType,
} from './_types/service.types';

/**
 * 草稿会话存储
 * 在实际项目中，应该使用Redis或数据库来存储会话
 */
const draftSessions = new Map<string, Draft>();

@Controller('jianying')
export class JianyingController {
  constructor(private readonly jianyingService: JianyingService) {}

  /**
   * 创建新草稿
   * @param params 创建参数
   * @returns 草稿会话ID
   */
  @Post('draft/create')
  createDraft(@Body() params: CreateDraftParamsType) {
    try {
      const result = this.jianyingService.createDraft(params);
      
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      // 生成会话ID并存储草稿
      const sessionId = this.generateSessionId();
      draftSessions.set(sessionId, result.data);

      return {
        success: true,
        data: {
          sessionId,
          message: result.message,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || '创建草稿失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 添加媒体文件到草稿
   * @param sessionId 草稿会话ID
   * @param params 添加媒体参数
   * @returns 添加结果
   */
  @Post('draft/:sessionId/media')
  addMedia(
    @Param('sessionId') sessionId: string,
    @Body() params: AddMediaParamsType,
  ) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const result = this.jianyingService.addMediaToDraft(draft, params);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '添加媒体失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 添加文本到草稿
   * @param sessionId 草稿会话ID
   * @param params 添加文本参数
   * @returns 添加结果
   */
  @Post('draft/:sessionId/text')
  addText(
    @Param('sessionId') sessionId: string,
    @Body() params: AddTextParamsType,
  ) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const result = this.jianyingService.addTextToDraft(draft, params);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '添加文本失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 添加特效到草稿
   * @param sessionId 草稿会话ID
   * @param params 添加特效参数
   * @returns 添加结果
   */
  @Post('draft/:sessionId/effect')
  addEffect(
    @Param('sessionId') sessionId: string,
    @Body() params: AddEffectParamsType,
  ) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const result = this.jianyingService.addEffectToDraft(draft, params);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '添加特效失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 保存草稿
   * @param sessionId 草稿会话ID
   * @returns 保存结果
   */
  @Post('draft/:sessionId/save')
  saveDraft(@Param('sessionId') sessionId: string) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const result = this.jianyingService.saveDraft(draft);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '保存草稿失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取草稿信息
   * @param sessionId 草稿会话ID
   * @returns 草稿信息
   */
  @Get('draft/:sessionId/info')
  getDraftInfo(@Param('sessionId') sessionId: string) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const duration = draft.calcDraftDuration();

      return {
        success: true,
        data: {
          sessionId,
          duration,
          durationSeconds: Math.round(duration / 1000000),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '获取草稿信息失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 生成转场数据
   * @param params 生成转场数据参数
   * @returns 转场数据
   */
  @Post('transition/generate')
  generateTransitionData(@Body() params: GenerateTransitionDataParamsType) {
    try {
      const result = this.jianyingService.generateTransitionData(params);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '生成转场数据失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 生成动画数据
   * @param params 生成动画数据参数
   * @returns 动画数据
   */
  @Post('animation/generate')
  generateAnimationData(@Body() params: GenerateAnimationDataParamsType) {
    try {
      const result = this.jianyingService.generateAnimationData(params);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '生成动画数据失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取媒体文件信息
   * @param filePath 文件路径
   * @returns 媒体文件信息
   */
  @Get('media/info')
  getMediaFileInfo(@Query('filePath') filePath: string) {
    try {
      if (!filePath) {
        throw new HttpException('文件路径不能为空', HttpStatus.BAD_REQUEST);
      }

      const result = this.jianyingService.getMediaFileInfo(filePath);

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '获取媒体文件信息失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取支持的文件格式
   * @returns 支持的文件格式列表
   */
  @Get('formats/supported')
  getSupportedFormats() {
    try {
      const result = this.jianyingService.getSupportedFormats();

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      throw new HttpException(
        error.message || '获取支持格式失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 批量添加媒体文件
   * @param sessionId 草稿会话ID
   * @param body
   * @returns 批量添加结果
   */
  @Post('draft/:sessionId/media/batch')
  batchAddMedia(
    @Param('sessionId') sessionId: string,
    @Body() body: { mediaFiles: string[]; commonOptions?: Partial<AddMediaParamsType> },
  ) {
    try {
      const draft = this.getDraftBySessionId(sessionId);
      const { mediaFiles, commonOptions = {} } = body;

      if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
        throw new HttpException('媒体文件列表不能为空', HttpStatus.BAD_REQUEST);
      }

      const result = this.jianyingService.batchAddMedia(draft, mediaFiles, commonOptions);

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '批量添加媒体失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 删除草稿会话
   * @param sessionId 草稿会话ID
   * @returns 删除结果
   */
  @Post('draft/:sessionId/close')
  closeDraft(@Param('sessionId') sessionId: string) {
    try {
      if (!draftSessions.has(sessionId)) {
        throw new HttpException('草稿会话不存在', HttpStatus.NOT_FOUND);
      }

      draftSessions.delete(sessionId);

      return {
        success: true,
        message: '草稿会话已关闭',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || '关闭草稿会话失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 根据会话ID获取草稿对象
   * @param sessionId 会话ID
   * @returns 草稿对象
   */
  private getDraftBySessionId(sessionId: string): Draft {
    const draft = draftSessions.get(sessionId);
    if (!draft) {
      throw new HttpException('草稿会话不存在或已过期', HttpStatus.NOT_FOUND);
    }
    return draft;
  }

  /**
   * 生成会话ID
   * @returns 会话ID
   */
  private generateSessionId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
