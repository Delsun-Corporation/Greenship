export class PageThree {
    constructor(
        thirdFormData,
        projectId
      ) {
        this.thirdFormData = thirdFormData;
        this.projectId = projectId;
      }

      convertToFormData() {
          var formData = new FormData();
          formData.append('c_ac[to_ti]', this.thirdFormData.c_ac.to_ti);
          formData.append('total_dec[ac]', this.thirdFormData.total_dec.ac);
          formData.append('total_dec[appliances]', this.thirdFormData.total_dec.appliances);
          formData.append('total_dec[lighting]', this.thirdFormData.total_dec.lighting);
          formData.append('total_dec[plug]', this.thirdFormData.total_dec.plug);
          formData.append('total_dec[utility]', this.thirdFormData.total_dec.utility);

          this.compileAppliances(formData);
          this.compileLighting(formData);
          this.compilePlug(formData);
          this.compileUtility(formData);
          
          if (this.thirdFormData.e_pv_install_att !== undefined) {
            formData.append('e_pv_install_att', this.thirdFormData.e_pv_install_att[0]);
          }

          if (this.thirdFormData.e_pv_solar_att !== undefined) {
            formData.append('e_pv_solar_att', this.thirdFormData.e_pv_solar_att[0]);
          }

          formData.append('projectId', this.projectId);

          return formData
      }

      compileAppliances(formData) {
        const appliances = this.thirdFormData.c_appliances;
        for (var i = 0; i < appliances.length; i++) {
            formData.append(`c_appliances[${i}][amount]`, appliances[i].amount);
            formData.append(`c_appliances[${i}][name]`, appliances[i].name);
            formData.append(`c_appliances[${i}][watt]`, appliances[i].watt);
        }
      }

      compileLighting(formData) {
        const lighting = this.thirdFormData.c_lighting;
        for (var i = 0; i < lighting.length; i++) {
            formData.append(`c_lighting[${i}][daylight_area]`, lighting[i].daylight_area);
            formData.append(`daylight_area_attach`, lighting[i].daylight_area_attach[0]);
            if (typeof lighting[i].daylight_area_attach !== 'string') {
                formData.append('daylightImageIndex[]', i);
            }
            formData.append(`c_lighting[${i}][lpd_nonoperate]`, lighting[i].lpd_nonoperate);
            formData.append(`lpd_nonoperate_attach`, lighting[i].lpd_nonoperate_attach[0]);
            if (typeof lighting[i].lpd_nonoperate_attach !== 'string') {
                formData.append('nonoperationalImageIndex[]', i);
            }
            formData.append(`c_lighting[${i}][lpd_operate]`, lighting[i].lpd_operate);
            formData.append(`lpd_operate_attach`, lighting[i].lpd_operate_attach[0]);
            if (typeof lighting[i].lpd_operate_attach !== 'string') {
                formData.append(`operationalImageIndex[]`, i);
            }
            formData.append(`c_lighting[${i}][name]`, lighting[i].name);
        }
      }

      compilePlug(formData) {
        const plug = this.thirdFormData.c_plug;
        formData.append(`c_plug[nonoperating_power]`, plug.nonoperating_power);
        formData.append(`c_plug[operating_power]`, plug.operating_power);
      }

      compileUtility(formData) {
        const utility = this.thirdFormData.c_utility;
        for (var i = 0; i < utility.length; i++) {
            formData.append(`c_utility[${i}][amount]`, utility[i].amount);
            formData.append(`c_utility[${i}][lift_capacity]`, utility[i].lift_capacity);
            formData.append(`c_utility[${i}][lift_velocity]`, utility[i].lift_velocity);
            formData.append(`c_utility[${i}][mv_flow_rate]`, utility[i].mv_flow_rate);
            formData.append(`c_utility[${i}][name]`, utility[i].name);
            formData.append(`c_utility[${i}][util_type]`, utility[i].util_type);
            formData.append(`c_utility[${i}][watt]`, utility[i].watt);
        }
      }
}