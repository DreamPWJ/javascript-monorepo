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
    { year: '1991', value: 15468 },
    { year: '1992', value: 16100 },
    { year: '1993', value: 15900 },
    { year: '1994', value: 17409 },
    { year: '1995', value: 17000 },
    { year: '1996', value: 31056 },
    { year: '1997', value: 31982 },
    { year: '1998', value: 32040 },
    { year: '1999', value: 33233 },
    { year: '2024', value: 42040 },
    { year: '2025', value: 53233 },
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
      .encode('x', (d) => d.year)
      .encode('y', 'value')
      .encode('shape', 'smooth') // 'area', 'smooth', 'hvh', 'vh', 'hv'
      .style('opacity', 0.2)
      .axis('y', { labelFormatter: '~s', title: false })

    chart.line().encode('x', 'year').encode('y', 'value').encode('shape', 'line') // 'line', 'smooth', 'vh', 'hv', 'hvh'

    // 渲染可视化
    chart.render()
  })

  return (
    <>
      <div className="app">
        <p  className="title">交易总体盈亏曲线图</p>
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
