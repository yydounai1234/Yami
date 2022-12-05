/**
 * 音频类
 * @public
 * @remarks 主要用于播放音频以及获取音频内容
 */
export declare class Track {
    private source;
    private audioContext;
    type: TrackType;
    private sourceDuration;
    private bufferSize;
    private sourceNode;
    private scriptNode;
    private soundTouch;
    private processBuffer;
    private gainNode;
    constructor(source: AudioBuffer | MediaStream, audioContext: AudioContext, type: TrackType);
    init(): void;
    /**
     * 获取变调
     */
    get pitch(): number;
    set pitch(newVal: number);
    /**
     * 获取音量
     */
    get volume(): number;
    set volume(newVal: number);
    /**
     * 获取音频时长
     */
    get duration(): number;
    /**
     * 获取当前时间
     */
    get currentTime(): number;
    /**
     * 播放
     */
    play(offset?: number): Promise<void>;
    /**
     * 恢复
     */
    resume(): void;
    /**
     * 暂停
     */
    pause(): void;
    /**
     * seek
     * @param time seek 指定时间
     */
    seek(time: number): void;
    /**
     * 获取数据
     * @remarks 该接口会造成 UI/JS 线程阻塞
     * @returns 获取处理后的数据
     */
    process(): Float32Array;
    /**
     *  释放资源
     */
    release(): void;
    private resetSourceDuration;
}

/**
 * 音频轨类型
 * @public
 */
export declare enum TrackType {
    /**
     * 输入为 url 链接
     */
    URL = "URL",
    /**
     * 输入为音频文件
     */
    BUFFER = "BUFFER",
    /**
     * 输入为音频流
     */
    MICROPHONE = "MICROPHONE"
}

/**
 * Yaml 类
 * @public
 * @remarks 主要用于创建各种音频轨
 */
export declare class Yami {
    /**
     * 根据 url 创建音频轨
     * @param url - 音频地址
     * @returns 音频轨
     */
    createURLTrack(url: string): Promise<Track>;
    /**
     * 根据 buffer 创建音频轨
     * @param buffer - 音频数据
     * @returns 音频轨
     */
    createBufferTrack(buffer: ArrayBuffer): Promise<Track>;
    /**
     * 根据麦克风创建音频轨
     * @param config - 音频配置项 @see [MediaTrackConstraints - Wikipedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)
     * @returns 音频轨
     */
    createMicrophoneTrack(config?: MediaTrackConstraints | boolean): Promise<Track>;
}

export { }
