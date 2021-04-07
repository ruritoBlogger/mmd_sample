import { WebGLRenderer, Scene, AmbientLight, PerspectiveCamera, SkinnedMesh, LoopOnce, AnimationClip, Clock } from "three";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper";

import useGetWindowSize from "./useGetWindowSize";
// import Model from "../models/こんにゃく式戌亥とこver1.0/戌亥とこ.pmx";

const Main: React.FC = () => {
  const { width, height } = useGetWindowSize();
  const clock = new Clock();
  let isAnimationStarted: boolean = false;
  let helper: MMDAnimationHelper = new MMDAnimationHelper();


  /**
   * モデルやアニメーションの読み込みを表示する
   * @param xhr どれだけ読み込んでいるかという情報
   */
  const onProgress = (xhr: ProgressEvent<EventTarget>) => {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  /**
   * モデルやアニメーションの読み込みに失敗した際に実行される
   * @param xhr 失敗した際のevent情報
   */
  const onError = (xhr: ErrorEvent) => {
    console.log("Load ERROR");
  }

  /**
   * モデルやアニメーションの読み込みを行う
   * @param scene 読み込んだ情報を取り込む先のシーン
   * @param mmd_path どのモデルを読み込むか
   * @param vmd_path どのアニメーションを読み込むか
   */
  const LoadModel = async (scene: Scene, mmd_path: string, vmd_path: string) => {
    const loader = new MMDLoader()

    /**
     * モデルを非同期処理を用いて読み込む
     * @param scene 読み込んだモデルを取り込むシーン
     * @param model_path どのモデルを読み込むか
     * @returns 読み込んだモデル
     */
    const LoadPMX = (scene: Scene, model_path: string): Promise<SkinnedMesh> => {
      // FIXME: rejectされる場合を追記したい
      return new Promise(resolve => {
        loader.load(model_path, (mesh: SkinnedMesh) => {
          scene.add(mesh);
          resolve(mesh);
        }, onProgress, onError);
      });
    }

    /**
     * アニメーションを非同期処理を用いて読み込む
     * @param mesh アニメーションを演じさせたいモデル
     * @param vmd_path どのアニメーションを読み込むか
     * @returns 読み込んだアニメーション
     */
    const LoadVMD = (mesh: SkinnedMesh, vmd_path: string): Promise<AnimationClip> => {
      // FIXME: rejectされる場合を追記したい
      return new Promise(resolve => {
        loader.loadAnimation(vmd_path, mesh, (vmd: AnimationClip | SkinnedMesh) => {
          vmd.name = "animation";
          if (vmd instanceof AnimationClip) {
            resolve(vmd);
          }
        }, onProgress, onError);
      });
    }

    /**
     * アニメーションを用いてMMDモデルを制御する
     * @param mesh 制御したいモデル
     * @param animation 読み込ませたいアニメーション
     */
    const VMDControl = (mesh: SkinnedMesh, animation: AnimationClip) => {

      isAnimationStarted = true;
      helper = new MMDAnimationHelper({ afterglow: 2.0, resetPhysicsOnLoop: true});

      helper.add(mesh, {
        animation: animation,
        physics: false
      });

      const mixer = helper.objects.get(mesh).mixer;

      mixer.addEventListener("finished", (event: any) => {
        VMDControl(mesh, animation);
      });
      isAnimationStarted = false;
    }

    // モデルやアニメーションを読み込む
    const mesh: SkinnedMesh = await LoadPMX(scene, mmd_path);
    const animation: AnimationClip = await LoadVMD(mesh, vmd_path)

    VMDControl(mesh, animation);
  }

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
    camera.position.set(0, 18, 15);

    // モデルやアニメーションを読み込む
    const mmd_path = "./models/こんにゃく式戌亥とこver1.0/戌亥とこ.pmx";
    const vmd_path = "./animations/loop.vmd";
    LoadModel(scene, mmd_path, vmd_path);

    const render = () => {
      requestAnimationFrame(render);
      renderer.clear();
      renderer.render(scene, camera);

      if (!isAnimationStarted) {
        helper.update(clock.getDelta());
      }
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
