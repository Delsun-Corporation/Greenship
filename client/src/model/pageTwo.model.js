export class PageTwo {
  constructor(
    secondFormData
  ) {
    this.windowAreaE = parseInt(secondFormData.b_window_area_e);
    this.windowAreaN = parseInt(secondFormData.b_window_area_n);
    this.windowAreaNE = parseInt(secondFormData.b_window_area_ne);
    this.windowAreaNW = parseInt(secondFormData.b_window_area_nw);
    this.windowAreaS = parseInt(secondFormData.b_window_area_s);
    this.windowAreaSE = parseInt(secondFormData.b_window_area_se);
    this.windowAreaSW = parseInt(secondFormData.b_window_area_sw);
    this.windowAreaW = parseInt(secondFormData.b_window_area_w);
    this.wallAreaE = parseInt(secondFormData.b_wall_area_e);
    this.wallAreaN = parseInt(secondFormData.b_wall_area_n);
    this.wallAreaR = parseInt(secondFormData.b_wall_area_r);
    this.wallAreaS = parseInt(secondFormData.b_wall_area_s);
    this.wallAreaW = parseInt(secondFormData.b_wall_area_w);
    this.wallAreaNE = parseInt(secondFormData.b_wall_area_ne);
    this.wallAreaNW = parseInt(secondFormData.b_wall_area_nw);
    this.wallAreaSE = parseInt(secondFormData.b_wall_area_se);
    this.wallAreaSW = parseInt(secondFormData.b_wall_area_sw);
  }

  getSaveDraftModel() {
      const b_window_area = [
          this.windowAreaN,
          this.windowAreaS,
          this.windowAreaE,
          this.windowAreaW,
          this.windowAreaNE,
          this.windowAreaSE,
          this.windowAreaNW,
          this.windowAreaSW
      ]

      const b_wall_area = [
          this.wallAreaN,
          this.wallAreaS,
          this.wallAreaE,
          this.wallAreaW,
          this.wallAreaNE,
          this.wallAreaSE,
          this.wallAreaNW,
          this.wallAreaSW,
          this.wallAreaR
      ]

      return {
        b_window_area: b_window_area,
        b_wall_area: b_wall_area
      }
  }
}
