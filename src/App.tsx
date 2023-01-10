import { List, Button, Input, Checkbox } from 'antd'

import { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Todo } from './@types/todo'

const App: React.FC = () => {
  const [list, setList] = useState<DocumentData[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [editMode, setEditMode] = useState<boolean>(false)
  const [docInfo, setDocInfo] = useState<DocumentData>({})

  async function fetchData(): Promise<void> {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(db, 'todos')
    )

    setList(querySnapshot.docs)
    return
  }

  async function handleAdd(): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        content: inputValue,
        completed: false
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    } finally {
      setInputValue('')
      fetchData()
    }
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'todos', id))
      console.log('Document deleted')
    } catch (e) {
      console.error('Error deleting document: ', e)
    } finally {
      fetchData()
    }
  }

  async function handleEdit(docInfo: DocumentData): Promise<void> {
    try {
      await setDoc(doc(db, 'todos', docInfo.id), {
        content: inputValue,
        completed: docInfo.data().completed
      })
      console.log('Document changed')
    } catch (e) {
      console.error('Error changing document: ', e)
    } finally {
      setInputValue('')
      setEditMode(!editMode)
      fetchData()
    }
  }

  function handleEditMode(docInfo: DocumentData): void {
    setEditMode(!editMode)
    setDocInfo(docInfo)
    return
  }

  async function handleCheck(
    id: string,
    content: string,
    completed: boolean
  ): Promise<void> {
    try {
      await setDoc(doc(db, 'todos', id), {
        content: content,
        completed: !completed
      })
      console.log('Document changed')
    } catch (e) {
      console.error('Error changing document: ', e)
    } finally {
      fetchData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main>
      <h1>Your daily TODO app</h1>
      <div className="todo-input">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Make a breakfast for Kitty"
          className="input"
        />

        {editMode ? (
          <div>
            <Button className="edit" onClick={() => handleEdit(docInfo)}>
              Edit todo
            </Button>
            <Button onClick={() => setEditMode(!editMode)}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={handleAdd}>Add todo</Button>
        )}
      </div>
      {!editMode && (
        <List
          className="list"
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item: DocumentData, index: number) => {
            const data: Todo = item.data()

            return (
              <List.Item key={index}>
                <Checkbox
                  checked={data.completed}
                  onChange={() =>
                    handleCheck(item.id, data.content, data.completed)
                  }
                />

                <h3
                  className={` ${
                    data.completed
                      ? 'list-item-content-completed'
                      : 'list-item-content'
                  }`}
                >
                  {data.content}
                </h3>
                <div>
                  <EditOutlined
                    onClick={() => handleEditMode(item)}
                    className="edit"
                  />
                  <DeleteOutlined
                    onClick={() => handleDelete(item.id)}
                    className="delete"
                  />
                </div>
              </List.Item>
            )
          }}
        />
      )}
    </main>
  )
}

export default App
