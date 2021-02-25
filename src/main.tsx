import { WebGLRenderer, Scene, AmbientLight, PerspectiveCamera } from "three";

import useGetWindowSize from "./useGetWindowSize";

const Main: React.FC = () => {
  const { width, height } = useGetWindowSize();

  /**
   * MMDモデルを読み込みThree.jsを用いて描画を行う
   * @param canvas MMDモデルを描画する先
   */
  const createCharactor = (canvas: HTMLCanvasElement) => {
    // シーンの作成
    const scene = new Scene();
    const renderer = new WebGLRenderer({ canvas: canvas, antialias: true });

    // 光の作成
    var ambient = new AmbientLight(0xeeeeee);
    scene.add(ambient);

    // 画面表示の設定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xcccccc, 0);
    document.body.appendChild(renderer.domElement);

    // カメラの作成
    camera.position.set(0, 10, 60);

    // モデルとモーションの読み込み準備
    var modelFile = "./mmd/miku/Lat式ミクVer2.31_Normal.pmd";
    var onProgress = function (xhr) {};
    var onError = function (xhr) {
      console.log("load mmd error");
    };
    //MMDLoaderをインスタンス化
    var loader = new MMDLoader();
    //loadModelメソッドにモデルのPATH
    //コールバックに画面に描画するための諸々のプログラムを書く
    loader.loadModel(
      modelFile,
      function (object) {
        mesh = object;
        mesh.position.set(0, -10, 0);
        mesh.rotation.set(0, 0, 0);
        scene.add(mesh);
      },
      onProgress,
      onError
    );

    // リサイズ時
    window.addEventListener("resize", onWindowResize, false);
  };

  return (
    <>
      <canvas id="canvas" />
    </>
  );
};

export default Main;
