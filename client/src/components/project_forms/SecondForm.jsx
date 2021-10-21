import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Stack,
} from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  InlineLabel,
} from "../FormLayouts";
import {
  formChapters,
} from "../../datas/Datas";
import {
  calcWWR
} from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const SecondForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({});
  const { control, handleSubmit, setValue } = methods;
  const [isLoading, setLoading] = useState(true);

  console.log(projectId);

  const onSubmit = (data) => {
    onceSubmitted(data);
  };

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/getpageone`, {
  //       params: {
  //         id: projectId,
  //       },
  //     })
  //     .then((res) => {
  //       setValue("firstForm", {
  //         ...res.data.page_one,
  //         a_typology: buildingTypology.find(
  //           (e) => e.type === res.data.page_one.a_typology
  //         ),
  //       });
  //       console.log(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Something went wrong, please try again");
  //     });
  // }, [projectId]);

  const CHAPTER_NUMBER = "2";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
          projectId={projectId}
          shouldRedirect={shouldRedirect}
          chapter={CHAPTER_NUMBER}
        />
        <FirstSection control={control} />
        <FormFooter chapter={CHAPTER_NUMBER} />
      </Stack>
    </form>
  );
};

export default SecondForm;

const FirstSection = ({ control }) => {
  const sectionName = "secondForm.";

  function CountWWR() {
    const windowArea = useWatch({
      control,
      name: sectionName + "b_window_area",
    });
    const wallArea = useWatch({
      control,
      name: sectionName + "b_wall_area",
    });
    if (windowArea && wallArea) {
      return (
        calcWWR(windowArea, wallArea) +
        "%"
      );
    }
    return NaN;
  }

  return (
    <FormLayout
      leftComponent={
        <Stack direction="column" spacing={2}>
          <SideInput
            name={sectionName + "b_ottv"}
            control={control}
            title="OTTV (kWh/m2)"
          />

          <SideInput
            name={sectionName + "b_shgc"}
            control={control}
            title="SHGC"
          />

          <SideInput
            name={sectionName + "b_window_area"}
            control={control}
            title="Window Area (m2)"
          />
          <SideInput
            name={sectionName + "b_wall_area"}
            control={control}
            title="Wall Area (m2)"
          />
          <InlineLabel
            title="WWR"
            value={CountWWR()}
          />
        </Stack>
      }
      rightComponent={
        <div className="font-body">
          <h1 className="text-xl font-black underline">Baseline Guidance:</h1>
          <h1 className="mt-6">
            <span className="font-regular">OTTV Baseline:</span>{" "}
            <span className="font-bold ml-2">45kWh/m2</span>
          </h1>
          <h1>
            <span className="font-regular">SHGC Baseline:</span>{" "}
            <span className="font-bold ml-2">0.6 - 0.7</span>
          </h1>
          <h1>
            <span className="font-regular">Window Area Baseline:</span>{" "}
            <span className="font-bold ml-2">45kWh/m2</span>
          </h1>
          <h1>
            <span className="font-regular">WWR:</span>{" "}
            <span className="font-bold ml-2">30 - 40%</span>
          </h1>
        </div>
      }
    />
  );
};
