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
    { type: 'BTC', date: '2024-07-01', value: 10 },
    { type: 'USDJPY', date: '2024-08-01', value: 20 },
    { type: 'GLOD', date: '2024-09-01', value: 20 },
    { type: 'BTC', date: '2024-12-01', value: 50 },
    { type: 'USDJPY', date: '2025-01-01', value: 20 },
    { type: 'GLOD', date: '2025-01-25', value: 60 },
    { type: 'BTC', date: '2025-02-01', value: 70 },
    { type: 'GLOD', date: '2025-03-25', value: 100 },
    { type: 'USDJPY', date: '2025-04-01', value: 60 },
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
      .encode('shape', 'smooth') // 'area', 'smooth', 'hvh', 'vh', 'hv'
      .encode('color', 'type')
      .style('fillOpacity', 0.8)
      //.style('fill', 'l(270) 0:#20404AFF 0.5:#28289BFF 1:#0000FFFF') // 配置面积图填充颜色为渐变色)
      .animate('enter', { type: 'scaleInX', duration: 1000 })
      .axis('y', { labelFormatter: '~s', title: false })

    chart.line().encode('x', 'date').encode('y', 'value').encode('shape', 'smooth') // 'line', 'smooth', 'vh', 'hv', 'hvh'

    // 渲染可视化
    chart.render()
  })

  return (
    <>
      <div className="app">
        <p className="title">总体盈亏曲线图</p>
        <Segmented<string>
          options={['年', '月', '周', '日']}
          size="large"
          onChange={(value) => {
            console.log(value) // string
          }}
        />
        <div id="container"></div>
        {/*  <Button type="primary">Button</Button>*/}
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
