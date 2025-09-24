# 剪映草稿生成器

这是一个用Node.js高度还原Python项目[JianyingDraft.PY](https://github.com/xiaoyiv/JianYingProDraft)功能的剪映草稿生成器。它可以帮助您程序化地创建剪映草稿文件，包括视频、音频、图片、文本、特效、转场和动画等各种元素。

## 功能特性

- ✅ **媒体文件支持**: 支持视频、音频、图片等多种格式
- ✅ **文本处理**: 支持添加文本字幕和标题
- ✅ **特效系统**: 内置多种特效，如烟花、星光、萤火等
- ✅ **转场效果**: 支持翻页、叠化、闪白等转场效果
- ✅ **动画系统**: 支持入场、出场和组合动画
- ✅ **批量处理**: 支持批量添加媒体文件
- ✅ **REST API**: 提供完整的HTTP接口
- ✅ **TypeScript**: 完整的类型定义和智能提示

## 项目结构

```
src/jianying/
├── _types/                 # TypeScript类型定义
│   ├── index.ts           # 基础类型
│   ├── template.types.ts  # 模板相关类型
│   └── service.types.ts   # 服务相关类型
├── core/                  # 核心功能
│   ├── draft.ts          # 草稿核心类
│   ├── media.ts          # 媒体基类
│   ├── mediaVideo.ts     # 视频媒体类
│   ├── mediaAudio.ts     # 音频媒体类
│   ├── mediaImage.ts     # 图片媒体类
│   ├── mediaText.ts      # 文本媒体类
│   ├── mediaEffect.ts    # 特效媒体类
│   └── mediaFactory.ts   # 媒体工厂类
├── templates/             # 模板文件
│   ├── template.ts       # 模板生成器
│   ├── draft_content.json    # 草稿内容模板
│   └── draft_meta_info.json # 草稿元数据模板
├── utils/                 # 工具函数
│   ├── tools.ts          # 通用工具
│   └── innerBizTypes.ts  # 内置业务类型
├── jianying.controller.ts # REST API控制器
├── jianying.service.ts    # 业务服务
├── jianying.module.ts     # NestJS模块
└── README.md             # 说明文档
```

## 快速开始

### 1. 基础用法

```typescript
import { JianyingService } from './jianying/jianying.service';

const jianyingService = new JianyingService();

// 创建草稿
const createResult = jianyingService.createDraft({
  name: '我的草稿',
  draftsRoot: 'C:/剪映草稿目录',
});

const draft = createResult.data;

// 添加图片
jianyingService.addMediaToDraft(draft, {
  mediaFilePath: 'path/to/image.jpg',
  duration: 5000000, // 5秒（微秒）
});

// 添加文本
jianyingService.addTextToDraft(draft, {
  textContent: '这是标题文本',
  duration: 3000000, // 3秒
});

// 保存草稿
jianyingService.saveDraft(draft);
```

### 2. 高级用法 - 带特效和动画

```typescript
// 生成转场数据
const transitionResult = jianyingService.generateTransitionData({
  nameOrResourceId: '翻页',
  duration: 700000, // 0.7秒
});

// 生成动画数据
const animationResult = jianyingService.generateAnimationData({
  nameOrResourceId: '渐隐',
  animationType: 'out',
  duration: 1000000, // 1秒
});

// 添加带特效的图片
jianyingService.addMediaToDraft(draft, {
  mediaFilePath: 'path/to/image.jpg',
  duration: 10000000,
  transitionData: transitionResult.data,
  animationDatas: [animationResult.data],
});

// 添加特效
jianyingService.addEffectToDraft(draft, {
  effectNameOrResourceId: '烟花',
  start: 2000000, // 2秒后开始
  duration: 5000000, // 持续5秒
});
```

### 3. 批量处理

```typescript
// 批量添加媒体文件
const mediaFiles = [
  'path/to/image1.jpg',
  'path/to/image2.jpg',
  'path/to/image3.jpg',
];

jianyingService.batchAddMedia(draft, mediaFiles, {
  duration: 3000000, // 每个3秒
  speed: 1.2, // 1.2倍速
});
```

## REST API接口

### 创建草稿
```http
POST /jianying/draft/create
Content-Type: application/json

{
  "name": "我的草稿",
  "draftsRoot": "C:/剪映草稿目录"
}
```

### 添加媒体
```http
POST /jianying/draft/{sessionId}/media
Content-Type: application/json

{
  "mediaFilePath": "path/to/video.mp4",
  "duration": 10000000,
  "speed": 1.0,
  "bgmMute": false
}
```

### 添加文本
```http
POST /jianying/draft/{sessionId}/text
Content-Type: application/json

{
  "textContent": "这是文本内容",
  "duration": 5000000
}
```

### 添加特效
```http
POST /jianying/draft/{sessionId}/effect
Content-Type: application/json

{
  "effectNameOrResourceId": "烟花",
  "start": 1000000,
  "duration": 3000000
}
```

### 保存草稿
```http
POST /jianying/draft/{sessionId}/save
```

## 支持的格式

### 视频格式
- .mp4, .avi, .mov, .wmv, .flv, .mkv, .webm, .m4v, .3gp, .ts

### 音频格式
- .mp3, .wav, .aac, .flac, .ogg, .wma, .m4a, .opus

### 图片格式
- .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg, .tiff, .ico

## 内置特效

### 特效列表
- 仙女棒、烟雾、星光绽放、萤火、镜头变焦
- 星雨、萤光飞舞、星星灯、烟花、星夜
- 星火、萤光、星河、光斑飘落、庆祝彩带
- 泡泡、星月童话、彩带、小花花、蝴蝶、落叶

### 转场列表
- 叠化、模糊、闪白、叠加、雾化、推近
- 泛光、翻页、闪黑、云朵、竖向模糊
- 向左擦除、前后对比II、开幕、左移、向右擦除
- 窗格、风车、倒影、分割II、粒子等

### 动画列表

#### 入场动画
- 渐显、动感放大、漩涡旋转、雨刷、向右下甩入
- 钟摆、向左下甩入、向右上甩入、向左上甩入
- 上下抖动、轻微抖动III、动感缩小、放大等

#### 出场动画
- 渐隐、放大、缩小、向左滑动、向右下甩出
- 折叠闭幕、向右滑动、轻微放大、向下滑动等

#### 组合动画
- 缩放、抖入放大、回弹伸缩、左拉镜、荡秋千
- 形变缩小、旋入晃动、向左下降、下降向右等

## 测试和演示

### 运行测试
```bash
npx tsx scripts/test-jianying.mts
```

### 运行演示
```bash
npx tsx scripts/jianying-demo.mts
```

演示脚本会创建一个完整的剪映草稿项目，包含：
- 多张图片素材
- 背景音乐（带淡入淡出）
- 文本字幕
- 转场效果
- 入场/出场动画
- 特效效果

## 使用生成的草稿

1. 运行演示脚本后，草稿文件会保存在 `jianying-demos` 目录
2. 将生成的草稿文件夹复制到剪映的草稿目录：
   - Windows: `C:\Users\用户名\AppData\Local\JianyingPro\User Data\Projects\com.lveditor.draft`
   - macOS: `~/Library/Containers/com.lveditor.universal/Data/Movies/JianyingPro/User Data/Projects/com.lveditor.draft`
3. 打开剪映软件，即可在草稿列表中看到导入的项目

## 注意事项

1. **时间单位**: 所有时间相关参数都使用微秒（microseconds）为单位
2. **文件路径**: 确保媒体文件路径正确且文件存在
3. **草稿目录**: 草稿保存目录需要有写入权限
4. **媒体信息**: 当前版本使用简化的媒体信息解析，实际项目中建议使用专业的媒体解析库
5. **兼容性**: 生成的草稿文件与剪映5.5.0版本兼容

## 开发说明

这个项目是对Python项目[JianyingDraft.PY](https://github.com/xiaoyiv/JianYingProDraft)的高度还原，主要差异：

1. **语言**: 使用TypeScript/Node.js替代Python
2. **架构**: 采用NestJS框架，提供REST API接口
3. **类型安全**: 完整的TypeScript类型定义
4. **媒体解析**: 使用Node.js生态的解决方案

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
