export class PageFour {
    constructor(
        fourthFormData,
        projectId
      ) {
        this.fourthFormData = fourthFormData;
        this.projectId = projectId;
      }

      convertToFromData() {
          var formData = new FormData();
          formData.append('d_a_az', this.fourthFormData.d_a_az);
          formData.append('d_a_is_potential', this.fourthFormData.d_a_is_potential);
          formData.append('d_a_ra', this.fourthFormData.d_a_ra);
          formData.append('d_a_rp', this.fourthFormData.d_a_rp);
          formData.append('d_b_velocity', this.fourthFormData.d_b_velocity);
          formData.append('d_c_access_area', this.fourthFormData.d_c_access_area);
          formData.append('d_e_temperature', this.fourthFormData.d_e_temperature);
          formData.append('d_f_noise_level', this.fourthFormData.d_f_noise_level);
          
          // Compile Total bhc - illuminance
          this.compileTotalBhc(formData)
          this.compileIlluminance(formData)
          
          if (this.fourthFormData.d_f_noise_control_att !== undefined) {
            formData.append('d_f_noise_control_att', this.fourthFormData.d_f_noise_control_att[0]);
          }

          if (this.fourthFormData.d_d_illuminance.d_d_lighting_plan_att !== undefined) {
            formData.append('d_d_lighting_plan_att', this.fourthFormData.d_d_illuminance.d_d_lighting_plan_att[0]);
          }

          if (this.fourthFormData.d_c_access_att !== undefined) {
            formData.append('d_c_access_att', this.fourthFormData.d_c_access_att[0]);
          }

          if (this.fourthFormData.d_a_attachment !== undefined) {
            formData.append('d_a_attachment', this.fourthFormData.d_a_attachment[0]);
          }

          if (this.fourthFormData.d_f_noise_att !== undefined) {
            formData.append('d_f_noise_att', this.fourthFormData.d_f_noise_att[0]);
          }

          formData.append('projectId', this.projectId);

          return formData

      }
      
      compileTotalBhc(formData) {
        formData.append('d_total_bhc[ach]', this.fourthFormData.d_total_bhc.ach);
        formData.append('d_total_bhc[vbz]', this.fourthFormData.d_total_bhc.vbz);

        const illuminance = this.fourthFormData.d_total_bhc.illuminance;
        for (var i = 0; i < illuminance.length; i++) {
            formData.append('d_total_bhc[illuminance][]', illuminance[i]);
        }
      }

      compileIlluminance(formData) {
        const illuminance = this.fourthFormData.d_d_illuminance;
        
        for (var i = 0; i < illuminance.length; i++) {
            formData.append(`d_d_illuminance[${i}][area]`, illuminance[i].area);
            formData.append(`d_d_illuminance[${i}][lamp_count]`, illuminance[i].lamp_count);
            formData.append(`d_d_illuminance[${i}][lamp_lumen]`, illuminance[i].lamp_lumen);
            formData.append(`d_d_illuminance[${i}][lamp_power]`, illuminance[i].lamp_power);
            formData.append(`d_d_illuminance[${i}][lamp_type]`, illuminance[i].lamp_type);
            formData.append(`d_d_illuminance[${i}][room_activity][e]`, illuminance[i].room_activity.e);
            formData.append(`d_d_illuminance[${i}][room_activity][locActivity]`, illuminance[i].room_activity.locActivity);
        }
      }
}