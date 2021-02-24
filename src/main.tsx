import * as THREE from 'three';
import {useEffect} from 'react';

const Main: React.FC = () => {

    const createBox = () => {
        // サイズを指定
        const width = 600;
        const height = 540;
        // レンダラを作成
        const renderer: any = new THREE.WebGLRenderer({
          canvas: document.querySelector("#canvas") as HTMLCanvasElement
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        // シーンを作成
        const scene = new THREE.Scene();
        // カメラを作成
        const camera = new THREE.PerspectiveCamera(45, width / height);
        camera.position.set(0, 0, +1000);
        // 箱を作成
        const geometry = new THREE.BoxGeometry(400, 400, 400);
        const material = new THREE.MeshNormalMaterial(); const box = new THREE.Mesh(geometry, material);
        scene.add(box);
        tick();
        // 毎フレーム時に実行されるループイベント
        function tick() {
          box.rotation.y += 0.01;
          renderer.render(scene, camera);
          // レンダリング
          requestAnimationFrame(tick);
        }
      };

      useEffect(() => {
        createBox();
      }, []);

    return (
      <>
        <canvas id="canvas" />
      </>
    )
}

export default Main;