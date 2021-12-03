export class PageOne {
    constructor(
        firstFormData,
        projectId
      ) {
        this.firstFormData = firstFormData;
        this.projectId = projectId;
      }

      convertToFromData() {
          var formData = new FormData();
          console.log(this.firstFormData);
          formData.append('project_name', this.firstFormData.project_name);
          formData.append('project_desc', this.firstFormData.project_desc);
          formData.append('a_ach', this.firstFormData.a_ach);
          formData.append('a_floor_count', this.firstFormData.a_floor_count);
          formData.append('a_floor_height_avg', this.firstFormData.a_floor_height_avg);
          formData.append('a_gfa', this.firstFormData.a_gfa);
          formData.append('a_holidays', this.firstFormData.a_holidays);
          formData.append('a_location_city', this.firstFormData.a_location_city);
          formData.append('a_location_province', this.firstFormData.a_location_province);
          formData.append('a_occupancy_category', this.firstFormData.a_occupancy_category);
          formData.append('a_occupancy_density', this.firstFormData.a_occupancy_density);
          formData.append('a_operational_hours', this.firstFormData.a_operational_hours);
          formData.append('a_typology', this.firstFormData.a_typology.type);
          formData.append('a_ventilation_area', this.firstFormData.a_ventilation_area);
          formData.append('a_working_days', this.firstFormData.a_working_days);
          
          if (this.firstFormData.a_project_image !== undefined) {
            formData.append('a_project_image', this.firstFormData.a_project_image[0]);
          }

          if (this.firstFormData.a_energy_place_image !== undefined) {
            formData.append('a_energy_place_image', this.firstFormData.a_energy_place_image[0]);
          }

          if (this.firstFormData.a_location_image !== undefined) {
            formData.append('a_location_image', this.firstFormData.a_location_image[0]);
          }

          if (this.firstFormData.a_micro_noise_image !== undefined) {
            formData.append('a_micro_noise_image', this.firstFormData.a_micro_noise_image[0]);
          }

          if (this.firstFormData.a_orientation_image !== undefined) {
            formData.append('a_orientation_image', this.firstFormData.a_orientation_image[0]);
          }

          formData.append('projectId', this.projectId);

          return formData
      }

}