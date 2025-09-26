# JianYing 模块功能概览

本目录为基于 NestJS 的剪映草稿生成能力，当前已实现的核心能力如下：

1. **草稿模板常量化管理**
   - 通过 `template/draft.ts` 暴露 `draft_content`、`draft_meta_info` 常量，便于统一维护草稿初始结构。
   - 字段采用 JSDoc 注释，方便查阅每个配置项的用途。

2. **草稿创建与存储**
   - `core/draft.ts` 的 `createDraft()` 会深拷贝模板常量生成草稿数据，生成的草稿目录固定写入项目 `public/<草稿名>`。
   - 自动初始化草稿 ID、时间戳、目录信息等基础元数据。

3. **媒体素材入轨**
   - 支持视频、音频、图片、文本四类素材类（`MediaVideo`、`MediaAudio`、`MediaImage`、`MediaText`）。
   - `MediaFactory.create()` 自动解析媒资信息并实例化对应素材类。
   - `addMedia()` 将素材同步写入 `draft_content` 的 materials / tracks 与 `draft_meta_info` 的素材池。

4. **视频/音频基础属性处理**
   - 视频素材支持设置播放速度、画布、静音等基础属性，并可挂载转场、动画等引用 ID。
   - 音频素材支持变速、声道映射与节拍，并可按需注入淡入淡出效果。

5. **视频特效挂载**
   - 提供 `MediaEffect`，可通过 `addEffect()` 将剪映内置或资源 ID 特效写入草稿。
   - 特效数据会写入 `materials.video_effects` 并生成对应的轨道片段。

6. **草稿时长与落盘**
   - `calcDraftDuration()` / `calcDuration()` 根据轨道片段自动计算草稿时长并同步至内容与元数据。
   - `save()` 负责创建目标目录、输出 `draft_content.json` 与 `draft_meta_info.json`。

> 说明：当前实现聚焦草稿基础生成及音视频媒体入轨，尚未覆盖模板模式、关键帧、字幕导入等高级能力。

