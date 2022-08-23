import {
    Grid,
    Heading,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Center,
    TableCaption,
    GridItem,
    Flex,
    Button,
    Checkbox,
    Stack,
} from "@chakra-ui/react"
import {
    CheckIcon,
    CloseIcon,
} from '@chakra-ui/icons'
import dayjs from "dayjs"
import {isAxiosError} from "axios"
import { useEffect, useState } from "react"
import { CustomAlert } from "../../../components/customAlert"
import { axiosClient } from "../../../utils/axios"
import { useNavigate } from "react-router-dom"
export const ListOfTodo = () => {
    const navigate = useNavigate()
    const [originalData, setOriginalData] = useState([])
    const [tableData, setTableData] = useState([])
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isDoneFilter, setIsDoneFilter] = useState("")

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (isDoneFilter === "") {
            setTableData([...originalData])
        } else if (isDoneFilter) {
            setTableData([...originalData].filter(item => item.isDone))
        } else {
            setTableData([...originalData].filter(item => !item.isDone))
        }
    }, [isDoneFilter, originalData.join("")])

    const getData = async () => {
        try {
            const { data } = await axiosClient.get("/todo")
            setOriginalData(data)
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response.data.message)
            } else {
                setMessage("Have an issue! Try again!")
            }
            setOriginalData([])
        }
        setIsLoading(false)
    }

    const onChangeIsDoneFilter = (newValue) => {
        setIsDoneFilter((prev) => newValue === prev ? "" : newValue)
    }

    const changeStatus = async (task) => {
        setIsLoading(true)
        try {
            await axiosClient.put(`/todo/${task.id}`, {...task, isDone: true})
            setOriginalData([])
            getData()
        } catch (err) {
            if (isAxiosError(err)) {
                setMessage(err.response.data.message)
            } else {
                setMessage("Have an issue! Try again!")
            }
            setIsLoading(false)
        }

    }

    if (isLoading) return <div>...Loading...</div>
    return (
        <Grid padding={30}>
            <Heading> Todo List</Heading>
            <Grid gap={1} paddingTop={30}>
                {!!message && <CustomAlert status="error" message={message} />}
            </Grid>
            <Grid gap={1}>
                <GridItem padding={30}>
                    <Flex justify="space-between">
                        <div>
                            <Stack spacing={5} direction='row'>
                                <Checkbox onChange={() => onChangeIsDoneFilter(true)} isChecked={!!isDoneFilter}>Done</Checkbox>
                                <Checkbox onChange={() => onChangeIsDoneFilter(false)} isChecked={isDoneFilter === false}>
                                    Doing
                                </Checkbox>
                            </Stack>
                        </div>
                        <Button colorScheme="teal" onClick={() => navigate("/create")}>Create</Button>
                    </Flex>
                </GridItem>
                <GridItem paddingBottom={30}>
                <TableContainer>
                    <Table colorScheme='teal'>
                        <TableCaption>List of Todo</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>
                                    <Center>
                                        Title
                                    </Center>
                                </Th>
                                <Th>
                                    <Center>
                                        Created At
                                    </Center>
                                </Th>
                                <Th>
                                    <Center>
                                        Done
                                    </Center>
                                </Th>
                                <Th>
                                    <Center>
                                        Action
                                    </Center>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableData.map((item) => (
                                <Tr 
                                    _hover={{
                                        background: "#e5e5e5",
                                        cursor: "pointer",
                                    }}
                                    key={item.id}
                                >
                                    <Td
                                        _hover={{
                                            textDecoration: 'underline',
                                        }}
                                        onClick={() => navigate(`edit/${item.id}`)}
                                    >
                                        <Center>
                                            {item.title}
                                        </Center>
                                    </Td>
                                    <Td>
                                        <Center>
                                            {dayjs(item.createdAt).format("MM/DD/YYYY")}
                                        </Center>
                                    </Td>
                                    <Td>
                                        <Center>
                                            {item.isDone ? <CheckIcon /> : <CloseIcon /> }
                                        </Center>
                                    </Td>
                                    <Td>
                                        <Center>
                                            {!item.isDone && <Button onClick={() => changeStatus(item)}>Done</Button> }
                                        </Center>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                </GridItem>
            </Grid>
        </Grid>
    )
}