import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import {
  FormLayout,
  FormHeader,
  FormFooter,
  SideInput,
  BlockInput,
  SelectInput,
  InlineLabel,
} from "../FormLayouts";
import {
  formChapters,
  occupancyCategory,
  buildingTypology,
  AchReference,
} from "../../datas/Datas";
import {
  calcOperatingHoursPerYear,
  calcNonOperatingHoursPerYear,
  calcOccupancy,
  calcRoomVolumePerPerson,
} from "../../datas/FormLogic";
import axios from "axios";
import { toast } from "react-toastify";

const SecondForm = ({ onceSubmitted, projectId, shouldRedirect }) => {
  const methods = useForm({});
  const { control, handleSubmit, setValue } = methods;
  const [isLoading, setLoading] = useState(true);

  console.log(projectId);

  const onSubmit = (data) => {
    console.log("DATA");
    console.log(data);
    onceSubmitted(data);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getpageone`, {
        params: {
          id: projectId,
        },
      })
      .then((res) => {
        setValue("firstForm", {
          ...res.data.page_one,
          a_typology: buildingTypology.find(
            (e) => e.type === res.data.page_one.a_typology
          ),
        });
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again");
      });
  }, [projectId]);

  const CHAPTER_NUMBER = "1";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={4} sx={{ paddingY: 10 }}>
        <FormHeader
          title={formChapters.find((e) => e.chapter === CHAPTER_NUMBER).title}
          projectId={projectId}
          shouldRedirect={shouldRedirect}
          chapter={CHAPTER_NUMBER}
        />
        {!isLoading && (
          <>
            <FirstSection control={control} />
          </>
        )}
        <FormFooter chapter={CHAPTER_NUMBER} />
      </Stack>
    </form>
  );
};

export default SecondForm;

const FirstSection = ({ control }) => {
    const sectionName = "firstForm.";
  
    return (
      <FormLayout
        leftComponent={
          <Stack direction="column" spacing={2}>
            <BlockInput
              name={sectionName + "project_name"}
              control={control}
              title="Project Name"
              rows={1}
              maxLength={50}
            />
  
            <BlockInput
              name={sectionName + "project_desc"}
              control={control}
              title="Project Description"
              rows={3}
              maxLength={400}
            />
          </Stack>
        }
        rightComponent={<>Building Image</>}
      />
    );
  };