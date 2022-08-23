import {
    InputControl,
    PercentComplete,
    RadioGroupControl,
    SubmitButton,
} from "formik-chakra-ui"
import { Formik } from "formik";
import * as Yup from "yup"
import {isAxiosError} from "axios"
import { Box, Grid, GridItem, Radio } from "@chakra-ui/react";
import { axiosClient } from "../../../utils/axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomAlert } from "../../../components/customAlert";

const validationSchema = Yup.object({
    title: Yup.string().required(),
    isDone: Yup.boolean().required(),
});

export const CreateToDo = () => {
    const navigator = useNavigate()
    const params = useLocation()
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        title: "",
        isDone: "true",
    })
    console.log({ navigator: params })
    useEffect(() => {
        getTaskDetail()
    }, [])

    const getTaskDetail = async() => {
        const id = params.pathname.split("/")[2]
        try {
            const {data} = await axiosClient.get(`todo/${id}`)
            setData({
                ...data,
                isDone: data.isDone.toString(),
            })
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response.data.message)
            } else {
                setMessage("Have an issue! Try again!")
            }
        }
        setIsLoading(false)
    }

    const onSubmit = async (values) => {
        setIsLoading(true)
        try {
            await axiosClient.post("/todo", {
                ...values,
                isDone: Boolean(values.isDone)
            })
            navigator("/")
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response.data.message)
            } else {
                setMessage("Have an issue! Try again!")
            }
        }
        setIsLoading(false)
    };
    if (isLoading) return <div>...Loading...</div>
    return (
        <Grid gap={1}>
            <Grid gap={1} paddingTop={30}>
                <GridItem>
                    {!!message && <CustomAlert status="error" message={message} />}
                </GridItem>
            </Grid>
            <Grid gap={1} padding={30}>
                <GridItem>
                    <Formik
                        initialValues={data}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                    {({ handleSubmit }) => (
                        <Box
                        borderWidth="1px"
                        rounded="lg"
                        shadow="1px 1px 3px rgba(0,0,0,0.3)"
                        maxWidth={800}
                        p={6}
                        m="10px auto"
                        as="form"
                        onSubmit={handleSubmit}
                        >
                            <InputControl name="title" label="Title" />
                            <RadioGroupControl name="isDone" label="Completed status">
                                <Radio value="true">Done</Radio>
                                <Radio value="false">Doing</Radio>
                            </RadioGroupControl>
                            <PercentComplete />
                            <SubmitButton>Submit</SubmitButton>
                        </Box>
                    )}
                    </Formik>
                </GridItem>
            </Grid>
        </Grid>
    )
    
}