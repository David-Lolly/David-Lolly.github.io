"use client"

import React, { useState, useEffect, useRef } from 'react';
import { thoughts } from "#site/content";
import { Header } from "@/components/header";

const IconPlay = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const IconPause = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

const MODE_AUTO = 'AUTO';
const MODE_TEMP_PAUSE = 'TEMP_PAUSE';
const MODE_FORCE_PAUSE = 'FORCE_PAUSE';

export default function YousiUniverse() {
    const [activeIndex, setActiveIndex] = useState(0);

    // 核心：三态播放模式
    const [playMode, setPlayMode] = useState(MODE_AUTO);
    const playModeRef = useRef(MODE_AUTO);
    const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [showHint, setShowHint] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 渲染并解析 Velite 数据源，按日期降序排列，固定将"欢迎光临"置顶
    const thoughtsData = React.useMemo(() => {
        const data = thoughts[0]?.items || [];

        // 1. 分离问候语和其他游思
        const greetings = data.filter(t => t.tag === '欢迎光临');
        const others = data.filter(t => t.tag !== '欢迎光临');

        // 2. 将普通游思按日期降序排列（最新在前）
        const sortedOthers = [...others].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // 3. 将问候语置顶拼接
        const combined = [...greetings, ...sortedOthers];

        return combined.map((t, idx) => ({
            id: idx + 1,
            content: t.content.trim(),
            date: t.date.replace(/-/g, '/').substring(0, 10),
            tag: t.tag,
            note: t.note || ""
        }));
    }, []);

    // 物理引擎状态：重构为统一目标缓动系统
    const physics = useRef({
        targetAngle: 0,    // 目标要到达的角度 (步进点)
        currentAngle: 0,   // 当前实际渲染的角度 (宇宙全局时间基准)
        idleSpeed: 0.05    // 闲置状态下的自然流逝速度
    });
    const manualSteeringUntilRef = useRef(0);
    const touchStartY = useRef(0);

    const activeIndexRef = useRef(0);
    const starsRef = useRef<any[]>([]);
    const meteorsRef = useRef<any[]>([]); // 新增：流星系统

    // 初始化引导定时器：8秒后自动消失
    useEffect(() => {
        const hintTimer = setTimeout(() => setShowHint(false), 8000);
        return () => clearTimeout(hintTimer);
    }, []);

    // 初始化星星与流星
    useEffect(() => {
        const starColors = ['#ffffff', '#e0f2fe', '#fef08a', '#ffedd5']; // 纯白，冷蓝，暖黄，浅橙
        starsRef.current = Array.from({ length: 400 }).map(() => ({
            x: Math.random() * 3000 - 500, // 扩大星空范围，适配平移后的坐标系
            y: Math.random() * 3000 - 1500,
            size: Math.random() * 1.5 + 0.2,
            alpha: Math.random(),
            twinkleSpeed: Math.random() * 0.01 + 0.002,
            color: starColors[Math.floor(Math.random() * starColors.length)],
            isBright: Math.random() > 0.92 // 8% 的概率成为发光的亮星
        }));
    }, []);

    // --- Canvas 核心渲染循环 ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        let lastTime = 0;

        // 辅助工具：在圆内裁剪绘制，防止溢出边缘
        const drawClip = (x: number, y: number, r: number, drawInner: () => void) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.clip();
            drawInner();
            ctx.restore();
        };

        const render = (timestamp: number) => {
            if (!containerRef.current || !canvas) return;

            // 计算时间间隔 deltaTime，单位为秒，防止高刷屏导致物理加速
            if (!lastTime) lastTime = timestamp;
            const deltaTime = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            const totalNodes = thoughtsData.length > 0 ? thoughtsData.length : 1;
            const segmentAngle = 360 / totalNodes;

            // 核心物理修改：确保每条感悟之间精确消耗 6 秒
            // 速度 = 每秒转动的角度
            physics.current.idleSpeed = segmentAngle / 6;

            // --- 全局物理与时间更新 ---
            // 计算当前真实角度与目标节点的差值
            const diff = physics.current.targetAngle - physics.current.currentAngle;
            const isManualSteering = performance.now() < manualSteeringUntilRef.current;

            if (Math.abs(diff) > 0.05) {
                // 手动滚动阶段提高跟随速度，保证交互即时响应
                const followRate = isManualSteering ? 16 : 5;
                const followAlpha = Math.min(1, deltaTime * followRate);
                physics.current.currentAngle += diff * followAlpha;
            } else {
                // 只有在完全 AUTO 模式下，时间才自动流淌
                if (playModeRef.current === MODE_AUTO) {
                    physics.current.targetAngle += physics.current.idleSpeed * deltaTime;
                }
                physics.current.currentAngle = physics.current.targetAngle;
            }

            // 手动滚动时按目标角度立刻切换文案；自动巡航时按真实角度切换
            const angleForIndex = isManualSteering ? physics.current.targetAngle : physics.current.currentAngle;
            const normalizedAngle = ((angleForIndex % 360) + 360) % 360;
            const newIndex = Math.floor(normalizedAngle / segmentAngle) % totalNodes;

            if (newIndex !== activeIndexRef.current) {
                activeIndexRef.current = newIndex;
                setActiveIndex(newIndex);
            }

            ctx.clearRect(0, 0, width, height);

            // --- 坐标系中心点设定 (吸附左侧边缘) ---
            const centerX = 0;
            const centerY = height / 2;
            ctx.translate(centerX, centerY);

            // --- 主题配置 ---
            // 直接读取 html 的 class 来做为准确判定，避免 setState 延迟导致闪烁
            const currentIsNight = document.documentElement.classList.contains('dark');
            const orbitColor = currentIsNight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(225, 225, 205, 0.6)';

            // 绘制星星与流星 (仅黑夜)
            if (currentIsNight) {
                // 1. 繁星点点 (带颜色和光晕)
                starsRef.current.forEach(star => {
                    star.alpha += star.twinkleSpeed;
                    if (star.alpha > 1 || star.alpha < 0) star.twinkleSpeed *= -1;

                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

                    // 解析十六进制颜色以使用 rgba 动态透明度
                    const r = parseInt(star.color.slice(1, 3), 16);
                    const g = parseInt(star.color.slice(3, 5), 16);
                    const b = parseInt(star.color.slice(5, 7), 16);
                    const currentAlpha = Math.max(0, Math.min(1, Math.abs(star.alpha)));
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.8})`;

                    // 亮星光晕
                    if (star.isBright) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = star.color;
                    }

                    ctx.fill();
                    ctx.shadowBlur = 0; // 重置
                });

                // 2. 随机流星划过
                if (Math.random() < 0.015 && meteorsRef.current.length < 2) {
                    meteorsRef.current.push({
                        x: Math.random() * width * 1.5, // 从屏幕中右侧及外部出生
                        y: -height / 2 - 100, // 从顶部外面出生
                        length: Math.random() * 100 + 60,
                        speed: Math.random() * 6 + 8, // 减慢流星的基础速度 (原来是 12 + 15)
                        angle: (Math.PI / 4) + (Math.random() * 0.1 - 0.05), // 约 45 度向左下角划过
                        alpha: 1
                    });
                }

                for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
                    const m = meteorsRef.current[i];
                    m.x -= m.speed * Math.cos(m.angle);
                    m.y += m.speed * Math.sin(m.angle);
                    m.alpha -= 0.006; // 减慢流星的消散速度，让它在屏幕上多划一会儿 (原来是 0.012)

                    if (m.alpha <= 0) {
                        meteorsRef.current.splice(i, 1);
                        continue;
                    }

                    // 流星渐变拖尾
                    const grad = ctx.createLinearGradient(m.x, m.y, m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle));
                    grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.beginPath();
                    ctx.moveTo(m.x, m.y);
                    ctx.lineTo(m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle));
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#e0f2fe';
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }

            // --- 核心调整：轨道充满屏幕 ---
            // 强制让最外层轨道 (海王星) 的半径精确等于屏幕宽度的 80%
            const maxOrbitRadius = width * 0.8;
            // 以 640 为基准计算轨道拉伸的缩放比例
            const scale = maxOrbitRadius / 640;

            // 星球本身的大小也适度放大，但不随轨道完全等比（避免大屏下星球巨无霸化）
            const pScale = Math.min(1.6, Math.max(0.6, width / 1000));

            // 8大行星轨道半径 (水、金、地、火、木、土、天王、海王)
            // 乘以 scale 后，最后一个元素的半径恰好为 width * 0.8
            const orbitRadii = [80, 130, 190, 240, 330, 440, 540, 640].map(r => r * scale);

            // 绘制 8 条行星轨道
            orbitRadii.forEach((radius, i) => {
                ctx.beginPath();
                ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2); // 只需要画右半圈提高性能
                ctx.strokeStyle = orbitColor;
                ctx.lineWidth = 1.5; // 基础线宽加粗
                // 地球轨道实线加粗，其他虚线
                if (i === 2) {
                    ctx.setLineDash([]);
                    ctx.lineWidth = 2.5; // 地球主轨道进一步加粗
                } else {
                    ctx.setLineDash([5, 5]); // 让虚线更紧密连贯，视觉上更明显
                }
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // 绘制地球轨道上的感悟节点刻度
            const earthRadius = orbitRadii[2];
            for (let i = 0; i < totalNodes; i++) {
                const nodeAngle = (i * segmentAngle) * (Math.PI / 180);
                const nx = earthRadius * Math.cos(nodeAngle);
                const ny = earthRadius * Math.sin(nodeAngle);

                ctx.beginPath();
                ctx.arc(nx, ny, 5, 0, Math.PI * 2); // 将刻度点稍微放大以匹配加粗的轨道
                if (i === activeIndexRef.current) {
                    ctx.fillStyle = currentIsNight ? '#fff' : 'rgb(34, 34, 34)';
                    ctx.shadowBlur = currentIsNight ? 10 : 0;
                    ctx.shadowColor = '#fff';
                } else {
                    ctx.fillStyle = currentIsNight ? 'rgba(255,255,255,0.3)' : 'rgb(200, 200, 180)';
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // --- 绘制宇宙天体 (采用扁平插画矢量风格) ---

            // 0. 太阳 (Sun)
            const sunR = 48 * pScale;

            // 渐变光晕层 (由内向外自然消散)
            const glowRadius = sunR * 2.5;
            const glowGradient = ctx.createRadialGradient(0, 0, sunR * 0.8, 0, 0, glowRadius);
            glowGradient.addColorStop(0, currentIsNight ? 'rgba(251, 191, 36, 0.4)' : 'rgba(251, 191, 36, 0.2)');
            glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');

            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();

            // 太阳本体 (纯净的金黄渐变)
            ctx.beginPath();
            ctx.arc(0, 0, sunR, 0, Math.PI * 2);
            const sunGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, sunR);
            sunGradient.addColorStop(0, '#FDE047'); // 中心明亮的浅黄
            sunGradient.addColorStop(1, '#F59E0B'); // 边缘沉稳的金黄
            ctx.fillStyle = sunGradient;
            ctx.fill();

            // --- 核心：提取宇宙全局时间 ---
            // 将地球所在的真实角度提取为全宇宙的标准时间体系，使得所有行星联动
            const time = physics.current.currentAngle * (Math.PI / 180);

            // 辅助函数：绘制普通行星
            const drawPlanet = (idx: number, angleBase: number, radius: number, baseColor: string, drawDetails?: (x: number, y: number, r: number) => void) => {
                const a = angleBase;
                const px = orbitRadii[idx] * Math.cos(a);
                const py = orbitRadii[idx] * Math.sin(a);

                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fillStyle = baseColor;
                ctx.fill();

                if (drawDetails) {
                    drawClip(px, py, radius, () => drawDetails(px, py, radius));
                }

                // 夜间模式给一点点微弱环境光
                if (currentIsNight) {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.stroke();
                }
            };

            // 1. 水星 (Mercury)
            drawPlanet(0, time * 2.5, 4.5 * pScale, '#CBA26C', (px, py, pr) => {
                ctx.fillStyle = '#956841';
                ctx.beginPath(); ctx.arc(px - pr * 0.2, py - pr * 0.2, pr * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(px + pr * 0.3, py + pr * 0.4, pr * 0.3, 0, Math.PI * 2); ctx.fill();
            });

            // 2. 金星 (Venus)
            drawPlanet(1, time * 1.5, 9 * pScale, '#D3CCC9', (px, py, pr) => {
                ctx.fillStyle = '#A19590';
                ctx.beginPath(); ctx.arc(px + pr * 0.2, py - pr * 0.3, pr * 0.3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(px - pr * 0.4, py + pr * 0.1, pr * 0.2, 0, Math.PI * 2); ctx.fill();
            });

            // 3. 地球 (Earth - 直接作为宇宙时间的主轴)
            const ex = earthRadius * Math.cos(time);
            const ey = earthRadius * Math.sin(time);
            const er = 10 * pScale;
            // 绘制地球指向太阳的观测线
            if (!currentIsNight) {
                ctx.beginPath(); ctx.moveTo(sunR, 0); ctx.lineTo(ex, ey);
                ctx.strokeStyle = 'rgba(229, 229, 209, 0.4)'; ctx.lineWidth = 1; ctx.stroke();
            }
            ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
            ctx.fillStyle = '#59A7D9'; ctx.fill(); // 海洋
            if (currentIsNight) { ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(89,167,217,0.5)'; ctx.fill(); ctx.shadowBlur = 0; }
            drawClip(ex, ey, er, () => {
                ctx.fillStyle = '#8ECB66'; // 陆地
                ctx.beginPath(); ctx.arc(ex - er * 0.2, ey - er * 0.3, er * 0.6, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ex + er * 0.5, ey + er * 0.2, er * 0.5, 0, Math.PI * 2); ctx.fill();
            });

            // 4. 火星 (Mars)
            drawPlanet(3, time * 0.8, 6.5 * pScale, '#F15D3C', (px, py, pr) => {
                ctx.fillStyle = '#D14429';
                ctx.fillRect(px - pr, py - pr * 0.4, pr * 2, pr * 0.3);
                ctx.fillRect(px - pr, py + pr * 0.2, pr * 2, pr * 0.2);
            });

            // 5. 木星 (Jupiter)
            drawPlanet(4, time * 0.3, 22 * pScale, '#DED2C2', (px, py, pr) => {
                ctx.fillStyle = '#C38E62';
                ctx.fillRect(px - pr, py - pr * 0.6, pr * 2, pr * 0.25);
                ctx.fillStyle = '#AD724E';
                ctx.fillRect(px - pr, py - pr * 0.1, pr * 2, pr * 0.35);
                ctx.fillStyle = '#C38E62';
                ctx.fillRect(px - pr, py + pr * 0.4, pr * 2, pr * 0.2);
                // 大红斑
                ctx.fillStyle = '#D14429';
                ctx.beginPath(); ctx.ellipse(px + pr * 0.3, py + pr * 0.05, pr * 0.3, pr * 0.15, 0, 0, Math.PI * 2); ctx.fill();
            });

            // 6. 土星 (Saturn - 带星环)
            const saturnA = time * 0.15;
            const sx = orbitRadii[5] * Math.cos(saturnA);
            const sy = orbitRadii[5] * Math.sin(saturnA);
            const sr = 18 * pScale;
            // 星环后半部分
            ctx.beginPath();
            ctx.ellipse(sx, sy, sr * 2.2, sr * 0.5, Math.PI / 12, Math.PI, Math.PI * 2);
            ctx.strokeStyle = '#D0B88D'; ctx.lineWidth = 6 * pScale; ctx.stroke();
            ctx.strokeStyle = '#FAF1DA'; ctx.lineWidth = 2 * pScale; ctx.stroke();
            // 土星本体
            ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fillStyle = '#EBD8B0'; ctx.fill();
            drawClip(sx, sy, sr, () => {
                ctx.fillStyle = '#D0B88D'; ctx.fillRect(sx - sr, sy - sr * 0.3, sr * 2, sr * 0.2);
                ctx.fillStyle = '#D0B88D'; ctx.fillRect(sx - sr, sy + sr * 0.2, sr * 2, sr * 0.3);
            });
            // 星环前半部分
            ctx.beginPath();
            ctx.ellipse(sx, sy, sr * 2.2, sr * 0.5, Math.PI / 12, 0, Math.PI);
            ctx.strokeStyle = '#D0B88D'; ctx.lineWidth = 6 * pScale; ctx.stroke();
            ctx.strokeStyle = '#FAF1DA'; ctx.lineWidth = 2 * pScale; ctx.stroke();

            // 7. 天王星 (Uranus - 带倾斜星环)
            const uraA = time * 0.08;
            const ux = orbitRadii[6] * Math.cos(uraA);
            const uy = orbitRadii[6] * Math.sin(uraA);
            const ur = 14 * pScale;
            ctx.beginPath();
            ctx.ellipse(ux, uy, ur * 1.8, ur * 0.3, -Math.PI / 3, Math.PI, Math.PI * 2);
            ctx.strokeStyle = '#7BE0E6'; ctx.lineWidth = 2 * pScale; ctx.stroke();
            ctx.beginPath(); ctx.arc(ux, uy, ur, 0, Math.PI * 2);
            ctx.fillStyle = '#56CAD5'; ctx.fill();
            drawClip(ux, uy, ur, () => {
                ctx.fillStyle = '#7BE0E6'; ctx.fillRect(ux - ur, uy - ur * 0.1, ur * 2, ur * 0.2);
            });
            ctx.beginPath();
            ctx.ellipse(ux, uy, ur * 1.8, ur * 0.3, -Math.PI / 3, 0, Math.PI);
            ctx.strokeStyle = '#7BE0E6'; ctx.lineWidth = 2 * pScale; ctx.stroke();

            // 8. 海王星 (Neptune)
            drawPlanet(7, time * 0.05, 13 * pScale, '#2B8DD8', (px, py, pr) => {
                ctx.strokeStyle = '#59BCF8';
                ctx.lineWidth = 2 * pScale;
                ctx.beginPath();
                ctx.moveTo(px - pr, py - pr * 0.2);
                ctx.quadraticCurveTo(px, py + pr * 0.3, px + pr, py - pr * 0.2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(px - pr, py + pr * 0.3);
                ctx.quadraticCurveTo(px, py - pr * 0.2, px + pr, py + pr * 0.4);
                ctx.stroke();
            });

            // 重置坐标系
            ctx.translate(-centerX, -centerY);

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, [thoughtsData]);

    // --- 交互处理：手工干预机制 ---
    const handleUserIntervention = () => {
        if (showHint) setShowHint(false);

        // 如果当前不是“强制暂停”状态，说明它是隐式意图，开启 30 秒倒计时
        if (playModeRef.current !== MODE_FORCE_PAUSE) {
            setPlayMode(MODE_TEMP_PAUSE);
            playModeRef.current = MODE_TEMP_PAUSE;

            // 清除并重启 30 秒恢复计时器
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = setTimeout(() => {
                // 30秒无操作后，如果状态仍然是临时悬停，则自动恢复巡航
                if (playModeRef.current === MODE_TEMP_PAUSE) {
                    setPlayMode(MODE_AUTO);
                    playModeRef.current = MODE_AUTO;
                }
            }, 30000);
        }
    };

    // --- 交互处理：滚动直接跳跃节点 (Stepper逻辑) ---
    const handleScroll = (e: React.WheelEvent) => {
        if (thoughtsData.length === 0) return;
        if (Math.abs(e.deltaY) < 2) return;

        // 触发隐式接管（附带 30s 恢复逻辑）
        handleUserIntervention();

        const segmentAngle = 360 / thoughtsData.length;
        // 寻找当前最靠近的轨道节点基准
        const currentSegment = Math.round(physics.current.targetAngle / segmentAngle);
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSegment = currentSegment + direction;

        physics.current.targetAngle = nextSegment * segmentAngle;
        manualSteeringUntilRef.current = performance.now() + 650;

        // 手动滚动时立即同步文本索引，避免“滚轮后长时间不切换”的迟滞感
        const total = thoughtsData.length;
        const nextIndex = ((nextSegment % total) + total) % total;
        if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
        }
    };

    // 移动端触控步进逻辑
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (thoughtsData.length === 0) return;
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 40) {
            handleUserIntervention();
            handleScroll({ deltaY: deltaY } as any);
        }
    };

    // --- UI 按钮强制控制 ---
    const handleTogglePlay = () => {
        if (showHint) setShowHint(false);

        if (playModeRef.current === MODE_AUTO || playModeRef.current === MODE_TEMP_PAUSE) {
            // 只要是播放或者隐式暂停，点击按钮统一变成【绝对强制暂停】，杀死定时器
            setPlayMode(MODE_FORCE_PAUSE);
            playModeRef.current = MODE_FORCE_PAUSE;
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        } else {
            // 从强制暂停中恢复播放
            setPlayMode(MODE_AUTO);
            playModeRef.current = MODE_AUTO;
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        }
    };

    // --- 样式定义 ---
    const dynamicStyles = `
    .theme-container {
      --bg-main: rgb(245, 245, 213);
      --text-main: rgb(34, 34, 34);
      --text-sub: rgb(115, 115, 115);
      --border-color: rgb(229, 229, 209);
        --tooltip-bg: rgba(250, 250, 228, 0.95);
      --accent-blue: rgb(37, 99, 235);
      --accent-yellow: rgb(234, 179, 8);
      --nav-bg: rgba(245, 245, 213, 0.8);
      --card-bg: rgba(250, 250, 228, 0.6);
      --mark-bg: rgb(200, 200, 180);
      background-color: var(--bg-main);
      color: var(--text-main);
    }
    html.dark .theme-container {
      --bg-main: #050810;
      --text-main: #F4F6F9;
      --text-sub: #94A3B8;
      --border-color: rgba(255, 255, 255, 0.1);
        --tooltip-bg: rgba(15, 23, 42, 0.85);
      --accent-blue: #60A5FA;
      --accent-yellow: #FBBF24;
      --nav-bg: rgba(5, 8, 16, 0.8);
      --card-bg: rgba(255, 255, 255, 0.03);
      --mark-bg: rgba(255, 255, 255, 0.3);
    }

    body {
      margin: 0;
      overflow: hidden;
    }

    /* 自定义呼吸动画：更慢更柔和 */
    @keyframes slowPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .animate-slow-pulse {
      animation: slowPulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .font-serif { font-family: "Times New Roman", Georgia, "Source Han Serif SC", "Noto Serif SC", serif; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, monospace; }
  `;

    const isCurrentlyAuto = playMode === MODE_AUTO;

    return (
        <div
            className="min-h-screen w-full relative theme-container transition-colors duration-[800ms]"
            ref={containerRef}
            onWheel={handleScroll}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

            {/* 顶部导航栏替换为统一Header */}
            <Header />

            {/* 背景 Canvas */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }} />

            {/* 居中文本内容区 */}
            <main className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-[80px]">
                <div className="w-full max-w-3xl h-[70%] px-8 relative flex flex-col justify-center">

                    <div className="absolute top-0 right-8 pointer-events-auto select-none">
                        <div className="flex items-center gap-3 relative">
                            {/* 去除了原生提示弹窗，改用自定义精美气泡 Tooltip */}
                            <div
                                onClick={handleTogglePlay}
                                className={`group relative flex items-center gap-1.5 cursor-pointer transition-all hover:text-[var(--text-main)] ${isCurrentlyAuto
                                    ? 'opacity-100 animate-slow-pulse text-[var(--text-main)]'
                                    : 'opacity-60 text-[var(--text-sub)] hover:opacity-100'
                                    }`}
                            >
                                {isCurrentlyAuto ? <IconPause /> : <IconPlay />}
                                <span className="text-xs font-mono tracking-widest">{isCurrentlyAuto ? '自动巡航' : '星轨悬停'}</span>

                                {/* ========================================= */}
                                {/* 新增：精美的自定义悬停气泡 Tooltip           */}
                                {/* ========================================= */}
                                <div
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-3 py-1.5 rounded-md text-[10px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 shadow-md backdrop-blur-md border z-50 -translate-y-1 group-hover:translate-y-0"
                                    style={{
                                        backgroundColor: 'var(--tooltip-bg)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    {isCurrentlyAuto ? '点击强制悬停星轨' : '点击恢复自动巡航'}

                                    {/* 指向按钮向上的小三角形 */}
                                    <div
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                        style={{ borderBottomColor: 'var(--border-color)' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="w-[1px] h-3 bg-[var(--border-color)]"></div>

                            <div className={`text-xs font-mono tracking-widest flex items-center gap-1 transition-all ${!isCurrentlyAuto
                                ? 'text-[var(--text-main)] opacity-100'
                                : `text-[var(--text-sub)] ${showHint ? 'opacity-100' : 'opacity-60'}`
                                }`}>
                                <span className={isCurrentlyAuto ? "" : "animate-bounce"}>↓</span> 滚动穿梭
                            </div>
                        </div>
                    </div>

                    {thoughtsData.length === 0 ? (
                        <div className="text-[var(--text-main)] text-xl font-serif">暂无游思记录</div>
                    ) : (
                        thoughtsData.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <div
                                    key={item.id}
                                    className="absolute w-[90%] md:w-[100%] transition-all duration-1000 ease-in-out pointer-events-auto"
                                    style={{
                                        opacity: isActive ? 1 : 0,
                                        transform: isActive ? 'translateY(0)' : `translateY(${idx < activeIndex ? '-40px' : '40px'})`,
                                        visibility: isActive ? 'visible' : 'hidden',
                                    }}
                                >
                                    <div className="text-6xl font-serif leading-none mb-4 opacity-30 select-none" style={{ color: 'var(--accent-yellow)' }}>"</div>
                                    <h2 className="text-2xl md:text-3xl font-serif leading-relaxed tracking-wide mb-8 drop-shadow-md">{item.content}</h2>
                                    <div
                                        className="p-5 rounded-lg backdrop-blur-sm border transition-colors duration-500"
                                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                                    >
                                        <p className="text-sm md:text-base leading-relaxed opacity-90 mb-4">{item.note}</p>
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                                            <div className="flex items-center gap-3 text-xs font-mono opacity-70">
                                                <span>{item.date}</span>
                                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-sub)' }}></span>
                                                <span style={{ color: 'var(--accent-blue)' }}>{item.tag}</span>
                                            </div>
                                            <div className="text-[10px] font-mono opacity-40">
                                                星轨坐标: {(idx * (360 / thoughtsData.length)).toFixed(1)}° / 第三行星
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
