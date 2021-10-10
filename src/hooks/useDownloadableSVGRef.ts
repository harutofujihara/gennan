import { useRef } from "react";

/**
 * svgをpngに変換
 * @param svgElement <svg>のHTML要素
 */
function svg2DataURL(
  svgElement: SVGSVGElement,
  widthPx = 640,
  heightPx = 640
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Canvasを用意する
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(Error("Create Canvas Error..."));
      return;
    }

    // 2. SVGを読み込む<image>を用意する
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      // 5. 読み込みが完了したら、Canvasに書き出して、
      ctx.drawImage(image, 0, 0, widthPx, heightPx);
      // 6. CanvasからDataURLを取得する
      resolve(canvas.toDataURL());
    };
    image.onerror = (e) => reject(e);

    // 3. <svg>を文字列に変換
    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const svgData = btoa(unescape(encodeURIComponent(svgXml)));

    // 4. 作成した<image>にDataURL形式でセットして、読み込み開始
    image.src = `data:image/svg+xml;charset=utf-8;base64,${svgData}`;
  });
}

export function useDownloadableSVGRef() {
  const ref = useRef<SVGSVGElement>(null);

  const download = async (
    filename: string = "image.png",
    widthPx = 640,
    heightPx = 640
  ) => {
    if (ref && ref.current) {
      const dataUrl = await svg2DataURL(ref.current, widthPx, heightPx);
      var link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    }
  };

  return { ref, download };
}
