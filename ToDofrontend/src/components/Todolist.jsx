import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

export default function Todolist() {
  const [inputval, setinputval] = useState({
    task: "",
    done: false,
  });
  const [fetchdata, setfetchdata] = useState([]);
  const [loading, setloading] = useState(false);

  // Sending data to the backend
  const submit = async () => {
    try {
      setloading(true);
      let response = await axios.post("http://localhost:3000/add", {
        Todos: inputval,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      location.reload();
      setloading(false);
    }
  };

  // Delete data
  const deletedata = async (id) => {
    try {
      let response = await axios.delete(`http://localhost:3000/delete/${id}`);
      console.log(response.data);
      setloading(true);
    } catch (err) {
      console.log('Failed to delete data', err);
    } finally {
      location.reload()
      setloading(false);
    }
  };

  // Updating the data
  const onchnagehandle = async (data, index, id) => {
    const updatedFetchData = [...fetchdata];
    updatedFetchData[index] = { ...data, done: !data.done };
    console.log(updatedFetchData);

    try {
      setloading(true);
      let response = await axios.patch(`http://localhost:3000/update/${id}`, {
        done: updatedFetchData[index].done,
      });
    } catch (err) {
      console.log("Update data failed", err);
    } finally {
      setloading(false);
      location.reload();
    }
  };

  // Getting the data
  useEffect(() => {
    const fetching = async () => {
      try {
        setloading(true);
        let response = await axios.get("http://localhost:3000/get");
        setfetchdata(response.data);
      } catch (err) {
        console.log("Fetching data failed");
      } finally {
        setloading(false);
      }
    };

    fetching();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-10">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Todo List</h1>

        {/* Input Section */}
        <div className="flex items-center mb-4">
          <input
            value={inputval.task}
            onChange={(e) => setinputval((prev) => ({ ...prev, task: e.target.value }))}
            className="w-full p-3 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Enter a new task..."
          />
          <button
            onClick={submit}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            {loading ? 'Loading....' : 'Submit'}
          </button>
        </div>

        {/* Task List Section */}
        <div>
          {fetchdata.map((data, index) => (
            <div key={data._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-3">
              <div className="flex items-center">
                <input
                  className="mr-4"
                  type="checkbox"
                  onChange={() => onchnagehandle(data, index, data._id)}
                  checked={data.done}
                />
                <ul className="list-none">
                <li
                  className={`text-[1.3rem] font-bold ${data.done ? 'line-through text-gray-500' : 'text-gray-800'}`}
                >
                  {data.task}
                </li>
                </ul>
              </div>
              <button
                onClick={() => deletedata(data._id)}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
