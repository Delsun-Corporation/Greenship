export class PageTwo {
  constructor(
    secondFormData
  ) {
    this.b_wall_area = secondFormData.b_wall_area;
    this.b_window_area = secondFormData.b_window_area;
  }

  getSaveDraftModel() {
      return {
        b_window_area: this.b_window_area,
        b_wall_area: this.b_wall_area
      }
  }
}
