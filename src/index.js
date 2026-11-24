import dumbbell from "lucide/icons/dumbbell.svg";

export default {
  fetch() {
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FORM</title><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#F2F2F7;color:#0088FF}svg{width:64px;height:64px}</style></head><body><div role="img" aria-label="FORM deployment test dumbbell">${dumbbell}</div></body></html>`;
    return new Response(html, {headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
  }
};
