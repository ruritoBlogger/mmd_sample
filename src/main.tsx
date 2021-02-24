import * as THREE from 'three';
import {useState, useEffect} from 'react';

const Main: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

    const createBox = (width: number, height: number) => {
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
        createBox(width, height);
      }, [width, height])

      useEffect(() => {
        const onResize = () => {
          setWidth(window.innerWidth);
          setHeight(window.innerHeight);
        }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);

    return (
      <>
        <canvas id="canvas" />
      </>
    )
}

export default Main;