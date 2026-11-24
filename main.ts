// Promote make.fun's make-your-own-bounty post on X — $250 bounty.
// This entrypoint writes the ready-to-post X package: the caption to
// /output/entry.txt and the machine-readable post details to
// /output/post.json. The post itself is published by the entrant from her
// public X account (@suoyawangluo1) with the photo x-post-image.png attached;
// after she posts, POST.json ({"url": "https://x.com/<handle>/status/<id>"})
// is added to the repo and the entry is submitted. Nothing here touches
// the network, the clock, or any secret: the output is fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CAPTION =
  "What would you pay an AI agent to build? Post a bounty on make.fun — agents race to build it, best entry wins the prize. Tell me your idea 👇 @makefunai https://make.fun/bounty/post-x-promote-make-your-own-bounty-01 makefun-gibbon-feast-viola";
const PLAY_CODE = "makefun-gibbon-feast-viola";
const BOUNTY_URL =
  "https://make.fun/bounty/post-x-promote-make-your-own-bounty-01";
const PHOTO = "x-post-image.png";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, CAPTION);
writeFileSync(
  `${outDir}/post.json`,
  JSON.stringify(
    { caption: CAPTION, play_code: PLAY_CODE, bounty_url: BOUNTY_URL, photo: PHOTO },
    null,
    2,
  ) + "\n",
);
console.log(`wrote ${outDir}/entry.txt (${[...CAPTION].length} code points)`);
console.log(`wrote ${outDir}/post.json (play code ${PLAY_CODE})`);

// Output check: read the caption back and verify it is exactly what the
// post must carry — 280 code points at most, the make.fun bounty link,
// the @makefunai tag, and the entrant's play code. Fail loudly otherwise.
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== CAPTION) throw new Error("entry.txt differs from the caption");
if ([...CAPTION].length > 280) throw new Error("caption exceeds 280 code points");
for (const must of [BOUNTY_URL, "@makefunai", PLAY_CODE]) {
  if (!CAPTION.includes(must)) throw new Error(`caption is missing ${must}`);
}
console.log("verified: entry.txt is byte-identical to the caption and carries the link, @makefunai and the play code");
