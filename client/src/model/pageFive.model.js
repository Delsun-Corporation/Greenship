export class PageFive {
    constructor(
        fifthFormData,
        projectId
      ) {
        this.fifthFormData = fifthFormData;
        this.projectId = projectId;
      }

      convertToFromData() {
          var formData = new FormData();
          console.log('xxx', this.fifthFormData);
          formData.append('e_facade_area', this.fifthFormData.e_facade_area);
          formData.append('e_pv_spec_wpeak', this.fifthFormData.e_pv_spec_wpeak);
          formData.append('e_pv_spec_dimension[l]', this.fifthFormData.e_pv_spec_l);
          formData.append('e_pv_spec_dimension[w]', this.fifthFormData.e_pv_spec_w);
          formData.append('e_pv_spec_dimension[h]', this.fifthFormData.e_pv_spec_h);
          formData.append('e_result[energy_percentage]', this.fifthFormData.e_result.energy_percentage);
          
          if (this.fifthFormData.e_pv_install_att !== undefined) {
            formData.append('e_pv_install_att', this.fifthFormData.e_pv_install_att[0]);
          }

          if (this.fifthFormData.e_pv_solar_att !== undefined) {
            formData.append('e_pv_solar_att', this.fifthFormData.e_pv_solar_att[0]);
          }

          formData.append('projectId', this.projectId);

          return formData
      }

}