import { useState } from "react";
import "./homepage.css";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_LIST, DELETE_LIST, UPDATE_LIST } from "../graphql/mutation";
import { GET_LIST } from "../graphql/query";

interface list {
  id: string;
  data: string;
  isCompleted: boolean;
  isDeleted: boolean;
}
function Homepage() {
  const [inputvalue, setInputValues] = useState<string>("");
  const [updatelist, setUpdateList] = useState<list | undefined>();
  const handleChange = (event: any) => {
    setInputValues(event.target.value);
  };

  const { data: listtodo, refetch } = useQuery(GET_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const [addTodo] = useMutation(ADD_LIST, {
    fetchPolicy: "network-only",
    onCompleted: () => {
      alert("List Added Successfully");
      refetch();
      setInputValues("");
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const [updateList] = useMutation(UPDATE_LIST, {
    onCompleted: () => {
      alert("List Updated Successfully");
      refetch();
      setInputValues("");
    },
    onError: () => {},
  });
  const handleSubmit = () => {
    if (updatelist) {
      updateList({
        variables: {
          id: updatelist.id,
          _set: {
            data: inputvalue,
          },
        },
      });
      setUpdateList(undefined);
      setInputValues("");
    } else {
      addTodo({
        variables: {
          value: inputvalue,
        },
      });
    }
  };

  const [deleteList] = useMutation(DELETE_LIST, {
    onCompleted: () => {
      alert("List Deleted");
      refetch();
      setInputValues("");
    },
  });
  const handleDelete = (id: string) => {
    deleteList({
      variables: {
        id: id,
      },
    });
  };
  const [completedList] = useMutation(UPDATE_LIST, {
    onCompleted: () => {
      refetch();
    },
  });
  const changeStyle = (id: string) => {
    completedList({
      variables: {
        id: id,
        _set: {
          isCompleted: true,
        },
      },
    });
  };
  const handleEdit = (todo: list) => {
    // const newlist =  [...todo];
    setInputValues(todo.data);
    // setIndex(indexes)
    // console.log(44,indexes)
    setUpdateList(todo);
  };
  return (
    <div className="todo">
      <h1>TODO LIST</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="forms"
      >
        <input
          className="data"
          placeholder="Enter the list"
          value={inputvalue}
          onChange={handleChange}
        />
        <button className="add">ADD</button>
      </form>
      <table className="list">
        <tbody>
          {listtodo?.todo_list.map((todo: any, index: number) => (
            <tr key={index}>
              <td>
                <h3
                  className={todo.isCompleted ? "todolist" : "listtodo"}
                  onClick={() => changeStyle(todo.id)}
                >
                  {todo.data}
                </h3>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className={todo.isCompleted ? "disapper" : "remove"}
                >
                  Remove
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleEdit(todo)}
                  className={todo.isCompleted ? "disapper" : "edit"}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Homepage;
