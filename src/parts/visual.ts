import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
// import { CircleGeometry } from 'three/src/geometries/CircleGeometry';
import { Scroller } from "../core/scroller";
import { Util } from "../libs/util";
import { Item } from "./item";
import { Color } from 'three/src/math/Color';
import { ItemScroll } from './itemScroll';
import { Conf } from '../core/conf';
import { HSL } from '../libs/hsl';
import { MousePointer } from '../core/mousePointer';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Item> = [];
  private _scrollItem:ItemScroll;
  private _scrollItemLight:ItemScroll;
  private _bgColor:Color = new Color();

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.l *= 0.8;
    col.setHSL(hsl.h, hsl.s, hsl.l);
    this._bgColor = col;

    // const geo = new CircleGeometry(0.5, 64);
    const geo = new PlaneGeometry(1,1);

    for(let i = 0; i < 10; i++) {
      const item = new Item({
        geo:geo,
        id:i,
      });
      this._con.add(item);
      this._item.push(item);
    }

    this._scrollItem = new ItemScroll({isLight:false})
    this._con.add(this._scrollItem);

    this._scrollItemLight = new ItemScroll({isLight:true})
    this._con.add(this._scrollItemLight);

    this._con.rotation.x = Util.instance.radian(45);
    this._con.rotation.y = Util.instance.radian(-45);

    Scroller.instance.set(0);
    this._resize()
  }


  protected _update(): void {
    super._update()

    // const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    this._con.position.y = Func.instance.screenOffsetY() * -1

    // this._con.rotation.z = Util.instance.radian(Util.instance.map(MousePointer.instance.easeNormal.y, -1, 1, -40, 40));
    this._con.rotation.y = Util.instance.radian(Util.instance.map(MousePointer.instance.easeNormal.x, -1, 1, -180, 180));
    // console.log(MousePointer.instance.easeNormal.x)

    const scrollItemSize = sh * 0.2;
    // const test = this._scrollItem.position.y;
    this._item.forEach((val,i) => {
      const test = this._scrollItem.position.y - Util.instance.map(i, 0, this._item.length - 1, 0, sh * 0.25);
      const v = (val.position.y - test) * -1;
      let radius = i == 0 ? 0 : 0.425;
      val.setRadius(Util.instance.map(v, 0, scrollItemSize * 0.5, radius, 0));
      val.rotation.x = Util.instance.radian(90);

      // val.position.y = -sh * 0.25 + i * Util.instance.map(Math.sin(this._c * 0.1), -1, 1, 2, 10);
      // val.setCenter(this._scrollItem.center)
    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(this._bgColor, 1)
    this.renderer.render(this.mainScene, this.cameraOrth)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    const itemSize = Math.min(w, h) * 0.5;
    this._item.forEach((val,i) => {
      val.setSize(itemSize, itemSize);
      // val.position.y = -h * 0.25;
      val.position.y = -h * 0.25 + i * 2;
    })

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
