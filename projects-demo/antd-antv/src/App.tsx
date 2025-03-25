import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Segmented } from 'antd'
import { Chart } from '@antv/g2'

function App() {
  const [count, setCount] = useState(0)
  // 准备数据
  const data = [
    { date: '1991-05-01', value: 15468 },
    { date: '1992-05-01', value: 16100 },
    { date: '1993-05-01', value: 15900 },
    { date: '1994-05-01', value: 17409 },
    { date: '1995-05-01', value: 17000 },
    { date: '1996-05-01', value: 31056 },
    { date: '1997-05-01', value: 31982 },
    { date: '1998-05-01', value: 32040 },
    { date: '1999-05-01', value: 33233 },
    { date: '2024-05-01', value: 42040 },
    { date: '2025-05-01', value: 53233 },
  ]

  useEffect(() => {
    // 初始化图表实例
    const chart = new Chart({
      container: 'container',
    })

    // 声明可视化
     chart.data(data)

    chart
      .area()
      .encode('x', (d) => d.date)
      .encode('y', 'value')
      .encode('shape', 'area') // 'area', 'smooth', 'hvh', 'vh', 'hv'
      .style('opacity', 0.9)
      .axis('y', { labelFormatter: '~s', title: false })

    chart.line().encode('x', 'date').encode('y', 'value').encode('shape', 'line') // 'line', 'smooth', 'vh', 'hv', 'hvh'

    // 渲染可视化
    chart.render()
  })

  return (
    <>
      <div className="app">
        <p  className="title">总体盈亏曲线图</p>
        <Segmented<string>
          options={['年', '月', '周', '日']}
          size="large"
          shape="round"
          onChange={(value) => {
            console.log(value); // string
          }}
        />
        <div id="container"></div>
{/*  <Button type="primary">Button</Button>*/
}
      </div>
{/*      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>*/}
    </>
  )
}

export default App
