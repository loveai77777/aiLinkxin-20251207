"use client";

export default function SoundWaveAnimation() {
  // 加长一倍：从20条增加到40条
  const bars = Array.from({ length: 40 }, (_, i) => {
    // 为每个条生成不规律的动画参数
    const baseDelay = i * 0.05; // 基础延迟
    const randomOffset = Math.random() * 0.4; // 随机偏移 0-0.4秒，让跳动更不规律
    const animationDelay = baseDelay + randomOffset;
    
    // 随机动画持续时间（1.5-3秒），让速度不规律且更慢
    const duration = 1.5 + Math.random() * 1.5;
    
    // 随机最小高度（20%-45%），让高度变化不规律
    const minHeight = 20 + Math.random() * 25;
    
    return {
      index: i,
      animationDelay,
      duration,
      minHeight,
    };
  });
  
  return (
    <div className="flex items-end justify-center gap-1.5 h-20 w-full py-4">
      {bars.map((bar) => (
        <div
          key={bar.index}
          className="w-2.5 rounded-t-sm bg-gradient-to-t from-purple-500 via-purple-400 to-purple-300"
          style={{
            height: '64px',
            animation: `soundWaveIrregular ${bar.duration}s ease-in-out infinite`,
            animationDelay: `${bar.animationDelay}s`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}
