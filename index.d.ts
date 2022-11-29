/**
 * 检查范围
 * @public
 * @remarks 目标值限定在两数范围内
 * @param x - 目标值
 * @param mi - 最小值
 * @param ma - 最大值
 * @returns 输出值
 */
export declare const checkLimits: (x: number, mi: number, ma: number) => number;

/**
 * 判定两个浮点数是否相等
 * @public
 * @param a - 浮点数 a
 * @param b - 浮点数 b
 * @returns 是否相等
 */
export declare const testFloatEqual: (a: number, b: number) => boolean;

/**
 * @public
 */
export declare class Track {
    private source;
    private audioContext;
    type: TrackType;
    private bufferSize;
    private sourceNode;
    private scriptNode;
    private soundTouch;
    private processBuffer;
    constructor(source: AudioBuffer | MediaStream, audioContext: AudioContext, type: TrackType);
    set pitch(newVal: number);
    /**
     * 获取变调
     */
    get pitch(): number;
    /**
     * 播放
     */
    play(): Promise<void>;
    /**
     * 获取数据
     * @remarks 该接口会造成 UI/JS 线程阻塞
     * @returns 获取处理后的数据
     */
    process(): Float32Array;
}

/**
 * 音频轨类型
 * @public
 */
export declare enum TrackType {
    URL = "URL",
    BUFFER = "BUFFER",
    MICROPHONE = "MICROPHONE"
}

/**
 * @public
 */
export declare class Yami {
    private audioContext;
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
     */
    createMicrophoneTrack(config?: MediaTrackConstraints | boolean): Promise<Track>;
}

export { }
