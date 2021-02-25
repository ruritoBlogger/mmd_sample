import { WebGLRenderer, Scene, AmbientLight, PerspectiveCamera } from "three";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";

import useGetWindowSize from "./useGetWindowSize";
// import Model from "../models/こんにゃく式戌亥とこver1.0/戌亥とこ.pmx";

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
    const ambient = new AmbientLight(0xeeeeee);
    scene.add(ambient);

    // 画面表示の設定
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xcccccc, 0);
    renderer.setSize(width, height);

    // カメラの作成
    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    // モデルとモーションの読み込み準備
    const modelFile = "./models/こんにゃく式戌亥とこver1.0/戌亥とこ.pmx";
    const onProgress = ({ loaded, total }) => {
      console.log(loaded, total);
    };
    const onError = (error: ErrorEvent) => {
      console.log(error);
    };

    //MMDLoaderをインスタンス化
    const loader = new MMDLoader();

    //コールバックに画面に描画するための諸々のプログラムを書く
    loader.load(
      modelFile,
      function (object) {
        let mesh = object;
        mesh.position.set(0, -10, 0);
        mesh.rotation.set(0, 0, 0);
        scene.add(mesh);
      },
      onProgress,
      (error) => onError(error)
    );

    const render = () => {
      requestAnimationFrame(render);
      renderer.clear();
      renderer.render(scene, camera);
    };

    render();
  };

  return (
    <>
      <canvas ref={createCharactor} />
    </>
  );
};

export default Main;
