import type { CSSProperties } from "react";

import type { PlatformVisual as Variant } from "@/lib/content";

const NEUTRAL = "#AEB6C6";
const STAR = "#C6CDDA";
const BRAND = "#FF3333";
const DIM = "#54555E";

/**
 * The three ambient card visuals for the intelligence platforms. Each is
 * generated from a small geometry table rather than hand-written markup — the
 * source design shipped ~60KB of literal SVG for the same three frames.
 *
 * Motion is CSS-driven (not SMIL) so it honours prefers-reduced-motion.
 */
export function PlatformVisual({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 440 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="block size-full bg-ink"
    >
      {variant === "memory" && <MemoryRadar />}
      {variant === "adaptive" && <AdaptiveBranches />}
      {variant === "collective" && <CollectiveMesh />}
    </svg>
  );
}

/* ── 01 · Memory & Knowledge — a radar sweeping a field of held traces ───── */

type Orbit = {
  radius: number;
  seconds: number;
  reverse?: boolean;
  /** [angle in degrees, radius, is brand-coloured] */
  dots: [number, number, boolean][];
};

const ORBITS: Orbit[] = [
  {
    radius: 46,
    seconds: 44,
    dots: [
      [20, 2.6, true],
      [150, 1.7, false],
      [-90, 2.6, true],
    ],
  },
  {
    radius: 70,
    seconds: 58,
    reverse: true,
    dots: [
      [40, 1.7, false],
      [110, 2.6, true],
      [-160, 1.7, false],
      [-60, 2.6, true],
    ],
  },
  {
    radius: 94,
    seconds: 74,
    dots: [
      [10, 2.6, true],
      [70, 1.7, false],
      [135, 1.7, false],
      [-165, 2.6, true],
      [-105, 1.7, false],
      [-40, 2.6, true],
    ],
  },
];

function MemoryRadar() {
  const cx = 220;
  const cy = 100;
  const spin = (seconds: number, reverse?: boolean): CSSProperties => ({
    transformOrigin: `${cx}px ${cy}px`,
    animation: `${reverse ? "spin-slow-reverse" : "spin-slow"} ${seconds}s linear infinite`,
  });

  return (
    <>
      <defs>
        <filter id="mem-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="mem-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>

      {ORBITS.map((orbit) => (
        <circle
          key={`ring-${orbit.radius}`}
          cx={cx}
          cy={cy}
          r={orbit.radius}
          fill="none"
          stroke={NEUTRAL}
          strokeOpacity="0.1"
        />
      ))}

      {/* Sweep wedge */}
      <path
        d="M 220 100 L 312.3 73.5 A 96 96 0 0 1 312.3 126.5 Z"
        fill="url(#mem-sweep)"
        style={spin(7)}
      />

      {/* Held traces, each ring drifting at its own rate */}
      {ORBITS.map((orbit) => (
        <g
          key={`orbit-${orbit.radius}`}
          style={spin(orbit.seconds, orbit.reverse)}
        >
          {orbit.dots.map(([angle, size, isBrand], index) => {
            const radians = (angle * Math.PI) / 180;
            return (
              <circle
                key={index}
                cx={(cx + orbit.radius * Math.cos(radians)).toFixed(1)}
                cy={(cy + orbit.radius * Math.sin(radians)).toFixed(1)}
                r={size}
                fill={isBrand ? BRAND : STAR}
                opacity={isBrand ? undefined : 0.55}
                filter={isBrand ? "url(#mem-glow)" : undefined}
                style={
                  isBrand
                    ? {
                        animation: `dot-pulse ${(2.6 + index * 0.4).toFixed(1)}s ease-in-out infinite`,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>
      ))}

      {/* Retrieval pings out of the core */}
      {[0, 1.8].map((delay) => (
        <circle
          key={delay}
          cx={cx}
          cy={cy}
          r="8"
          fill="none"
          stroke={BRAND}
          strokeWidth="1"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: `ring-out 3.6s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      <circle cx={cx} cy={cy} r="3.6" fill={BRAND} filter="url(#mem-glow)" />
    </>
  );
}

/* ── 02 · Adaptive Reasoning — one premise branching to live conclusions ── */

const BRANCHES = [
  { path: "M 80 100 C 180 100, 250 52, 366 52", target: 52 },
  { path: "M 80 100 C 180 100, 250 100, 366 100", target: 100 },
  { path: "M 80 100 C 180 100, 250 150, 366 150", target: 150 },
];

function AdaptiveBranches() {
  return (
    <>
      <defs>
        <filter id="adpt-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="adpt-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF5544" stopOpacity="0.55" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Reference grid */}
      <g stroke={NEUTRAL} strokeOpacity="0.045">
        {Array.from({ length: 10 }, (_, i) => 40 + i * 40).map((x) => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="180" />
        ))}
        {Array.from({ length: 4 }, (_, i) => 40 + i * 40).map((y) => (
          <line key={`h${y}`} x1="20" y1={y} x2="420" y2={y} />
        ))}
      </g>

      <line
        x1="-20"
        y1="100"
        x2="80"
        y2="100"
        stroke="#8A93A8"
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />

      {BRANCHES.map(({ path }, index) => (
        <g key={path}>
          <path
            d={path}
            fill="none"
            stroke="#8A93A8"
            strokeOpacity="0.2"
            strokeWidth="1.4"
          />
          <path
            d={path}
            fill="none"
            stroke={NEUTRAL}
            strokeOpacity="0.22"
            strokeWidth="1"
            pathLength={100}
            strokeDasharray="1.5 7"
            style={{
              animation: `dash-flow 2.2s linear ${(index * -0.4).toFixed(1)}s infinite`,
            }}
          />
          {/* Inference travelling the branch */}
          <circle
            r="4.2"
            fill="#FF7A6B"
            filter="url(#adpt-glow)"
            style={{
              offsetPath: `path("${path}")`,
              offsetRotate: "0deg",
              animation: `travel 6.6s linear ${(index * 2.2).toFixed(1)}s infinite`,
            }}
          />
        </g>
      ))}

      {/* Waypoint ticks */}
      {[
        [217, 76],
        [277.7, 61.2],
        [217, 100],
        [277.7, 100],
        [217, 125],
        [277.7, 140.4],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={NEUTRAL} />
      ))}

      {/* Source */}
      <circle
        cx="80"
        cy="100"
        r="10"
        fill="none"
        stroke={BRAND}
        strokeWidth="1"
        style={{
          transformOrigin: "80px 100px",
          animation: "ring-out 2.6s ease-out infinite",
        }}
      />
      <circle
        cx="80"
        cy="100"
        r="18"
        fill="url(#adpt-halo)"
        style={{ animation: "dot-pulse 2.4s ease-in-out infinite" }}
      />
      <circle cx="80" cy="100" r="4" fill={BRAND} filter="url(#adpt-glow)" />

      {/* Conclusions, lighting up as each inference lands */}
      {BRANCHES.map(({ target }, index) => (
        <g key={target}>
          <circle
            cx="366"
            cy={target}
            r="16"
            fill="url(#adpt-halo)"
            opacity="0"
            style={{
              animation: `node-arrive 6.6s ease-in-out ${(index * 2.2).toFixed(1)}s infinite`,
            }}
          />
          <circle cx="366" cy={target} r="3.4" fill={DIM} />
        </g>
      ))}
    </>
  );
}

/* ── 03 · Collective Intelligence — a graph network of clustered minds ───── */

type GraphNode = [x: number, y: number, kind: "core" | "hub" | "leaf"];

/**
 * A small-world graph: one shared core, four community hubs, and the members
 * of each community around its hub. Reads as a network diagram (clusters,
 * hubs, bridges) rather than a single path, which is the point of the card:
 * many minds, one memory.
 */
const GRAPH_NODES: GraphNode[] = [
  [220, 100, "core"], // 0
  [108, 68, "hub"], // 1
  [332, 62, "hub"], // 2
  [116, 150, "hub"], // 3
  [330, 146, "hub"], // 4
  [56, 44, "leaf"], // 5   community 1
  [62, 94, "leaf"], // 6
  [122, 24, "leaf"], // 7
  [160, 44, "leaf"], // 8
  [284, 30, "leaf"], // 9   community 2
  [380, 30, "leaf"], // 10
  [396, 80, "leaf"], // 11
  [280, 90, "leaf"], // 12
  [64, 128, "leaf"], // 13  community 3
  [72, 176, "leaf"], // 14
  [150, 186, "leaf"], // 15
  [170, 128, "leaf"], // 16
  [284, 182, "leaf"], // 17  community 4
  [372, 182, "leaf"], // 18
  [398, 124, "leaf"], // 19
  [272, 130, "leaf"], // 20
];

const GRAPH_EDGES: [number, number][] = [
  // Communities: every member to its hub, plus a few ties inside it.
  [1, 5], [1, 6], [1, 7], [1, 8], [5, 6], [7, 8],
  [2, 9], [2, 10], [2, 11], [2, 12], [9, 10], [10, 11],
  [3, 13], [3, 14], [3, 15], [3, 16], [13, 14], [14, 15],
  [4, 17], [4, 18], [4, 19], [4, 20], [17, 18], [18, 19],
  // Bridges between neighbouring communities.
  [1, 3], [2, 4], [8, 9], [6, 13], [16, 20], [11, 19],
  // Members with a direct line to the shared core.
  [0, 12], [0, 16], [0, 8], [0, 20],
];

/** Hub-to-core links: the "one memory" every community writes into. */
const CORE_LINKS: [number, number][] = [
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];

/** Signals in flight: [from, to, seconds, delay]. Leaves feed hubs, hubs feed
 *  the core, and the core feeds back out, several at once. */
const PACKETS: [number, number, number, number][] = [
  [5, 1, 2.4, 0],
  [1, 0, 2.6, 0.9],
  [10, 2, 2.4, 0.5],
  [2, 0, 2.6, 1.6],
  [14, 3, 2.4, 1.1],
  [3, 0, 2.6, 2.1],
  [18, 4, 2.4, 1.5],
  [4, 0, 2.6, 0.3],
  [0, 2, 2.8, 2.7],
  [0, 3, 2.8, 0.6],
  [8, 9, 3.2, 1.3],
  [16, 20, 3.2, 2.4],
];

const STARS: [number, number][] = [
  [30, 20],
  [200, 20],
  [420, 20],
  [20, 70],
  [425, 60],
  [190, 60],
  [250, 160],
  [20, 180],
  [425, 175],
  [215, 190],
];

function CollectiveMesh() {
  const at = (index: number) => GRAPH_NODES[index];

  return (
    <>
      <defs>
        <filter id="col-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="col-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF5544" stopOpacity="0.55" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="220" cy="100" r="70" fill="url(#col-halo)" opacity="0.14" />

      {STARS.map(([x, y], index) => (
        <circle
          key={`star-${x}-${y}`}
          cx={x}
          cy={y}
          r="1.1"
          fill={STAR}
          opacity="0.16"
          style={{
            animation: `star-twinkle ${(4 + (index % 5) * 0.4).toFixed(1)}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Structure: every connection is visible, so it reads as a graph */}
      {GRAPH_EDGES.map(([a, b]) => (
        <line
          key={`e-${a}-${b}`}
          x1={at(a)[0]}
          y1={at(a)[1]}
          x2={at(b)[0]}
          y2={at(b)[1]}
          stroke={NEUTRAL}
          strokeOpacity="0.2"
          strokeWidth="0.9"
        />
      ))}
      {CORE_LINKS.map(([a, b]) => (
        <line
          key={`c-${a}-${b}`}
          x1={at(a)[0]}
          y1={at(a)[1]}
          x2={at(b)[0]}
          y2={at(b)[1]}
          stroke={BRAND}
          strokeOpacity="0.45"
          strokeWidth="1.3"
        />
      ))}

      {/* Signals moving along edges in parallel */}
      {PACKETS.map(([from, to, seconds, delay]) => {
        const [x1, y1] = at(from);
        const [x2, y2] = at(to);
        return (
          <circle
            key={`p-${from}-${to}`}
            r="2.6"
            fill={BRAND}
            filter="url(#col-glow)"
            style={{
              offsetPath: `path("M${x1} ${y1} L${x2} ${y2}")`,
              offsetRotate: "0deg",
              animation: `travel ${seconds}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* Nodes, sized by role: core, community hubs, members */}
      {GRAPH_NODES.map(([x, y, kind], index) => {
        if (kind === "leaf") {
          return (
            <circle
              key={`n-${index}`}
              cx={x}
              cy={y}
              r="2.4"
              fill="#1a1a1d"
              stroke={STAR}
              strokeOpacity="0.7"
              strokeWidth="1"
            />
          );
        }
        const core = kind === "core";
        return (
          <g key={`n-${index}`}>
            <circle
              cx={x}
              cy={y}
              r={core ? 22 : 13}
              fill="url(#col-halo)"
              style={{
                animation: `dot-pulse ${core ? 3.2 : 2.6}s ease-in-out ${(index * 0.5).toFixed(1)}s infinite`,
              }}
            />
            <circle
              cx={x}
              cy={y}
              r={core ? 6.5 : 4.4}
              fill={BRAND}
              filter="url(#col-glow)"
            />
            {core && (
              <circle cx={x} cy={y} r="11" fill="none" stroke={BRAND} strokeOpacity="0.35" />
            )}
          </g>
        );
      })}
    </>
  );
}
