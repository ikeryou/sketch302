import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { DoubleSide } from 'three/src/constants';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { Val } from "../libs/val";
import { Tween } from "../core/tween";
import { HSL } from "../libs/hsl";
import { Vector2 } from 'three/src/math/Vector2';

export class ItemScroll extends MyObject3D {

  private _mesh:Mesh;
  private _rate:Val = new Val();

  public center:Vector2 = new Vector2();

  constructor(opt:any) {
    super()

    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.l *= opt.isLight ? 2 : 0.75;
    col.setHSL(hsl.h, hsl.s, hsl.l);

    this._mesh = new Mesh(
      new BoxGeometry(1,1,1),
      new MeshBasicMaterial({
        color: col,
        transparent:true,
        side:DoubleSide,
        depthTest:true,
      })
    );
    this.add(this._mesh);
    this._mesh.position.y = 0.5;

    if(opt.isLight) {
      this._mesh.position.x = 1.5;
    }

    this._motion();
  }


  private _motion():void {
    this.center.x = Util.instance.random(0, 1);
    this.center.y = Util.instance.random(0, 1);

    Tween.instance.a(this._rate, {
      val:[0, 1]
    }, 3, 0, Tween.ExpoEaseInOut, null, null, () => {
      this._motion();
    })
  }


  protected _update():void {
    super._update();

    // const sw = Func.instance.sh();
    const sh = Func.instance.sh();

    // const itemSize = Math.min(sw, sh) * 0.5;

    const height = sh * 0.5;
    const rate = this._rate.val;

    this.position.y = Util.instance.mix(sh * 1, -sh * 0.35, rate);

    this.scale.x = this.scale.z = 2;
    this.scale.y = Util.instance.mix(height, 0.0001, rate);

    // this.position.x = itemSize * this.center.x;
    // this.position.z = itemSize * this.center.y;
  }


  protected _resize(): void {
    super._resize();
  }
}