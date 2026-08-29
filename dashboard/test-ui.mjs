import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const screenshotDir = 'C:\\Users\\Yash\\.gemini\\antigravity\\brain\\095cc169-ed04-4cf1-b0d9-e47720eb4fc0'
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}

async function runTests() {
  console.log('Starting headless browser verification with Chrome...')
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1536, height: 960, deviceScaleFactor: 2 })

  const errors = []
  page.on('pageerror', err => {
    console.error('Page error:', err.toString())
    errors.push(err.toString())
  })
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console error:', msg.text())
      errors.push(msg.text())
    }
  })

  try {
    console.log('Navigating to http://localhost:5173/ ...')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 1500))

    // 1. Command Centre
    console.log('Capturing 01_command_centre.png ...')
    await page.screenshot({ path: path.join(screenshotDir, '01_command_centre.png') })

    // 2. Open Alert Drawer
    console.log('Opening alert evidence drawer...')
    const firstAlert = await page.$('.alert-card')
    if (firstAlert) {
      await firstAlert.click()
      await new Promise(r => setTimeout(r, 800))
      await page.screenshot({ path: path.join(screenshotDir, '02_alert_drawer.png') })
      
      // Close drawer with close button
      const closeBtn = await page.$('button[aria-label="Close evidence drawer"]')
      if (closeBtn) {
        await closeBtn.click()
        await new Promise(r => setTimeout(r, 500))
      }
    }

    // Helper to click nav item
    async function clickNav(name) {
      const buttons = await page.$$('nav button')
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn)
        if (text && text.includes(name)) {
          await btn.click()
          await new Promise(r => setTimeout(r, 800))
          break
        }
      }
    }

    // 3. Live Radar
    console.log('Navigating to Live Radar...')
    await clickNav('Live Radar')
    await page.screenshot({ path: path.join(screenshotDir, '03_live_radar.png') })

    // 4. Alerts Page
    console.log('Navigating to Alerts...')
    await clickNav('Alerts')
    await page.screenshot({ path: path.join(screenshotDir, '04_alerts_page.png') })

    // 5. Vehicle Search
    console.log('Navigating to Vehicle Search...')
    await clickNav('Vehicle Search')
    await page.screenshot({ path: path.join(screenshotDir, '05_vehicle_search.png') })

    // 6. Cases Page
    console.log('Navigating to Cases...')
    await clickNav('Cases')
    await page.screenshot({ path: path.join(screenshotDir, '06_cases_page.png') })

    // 7. Traffic Analytics
    console.log('Navigating to Traffic Analytics...')
    await clickNav('Traffic Analytics')
    await page.screenshot({ path: path.join(screenshotDir, '07_traffic_analytics.png') })

    // 8. Camera Network
    console.log('Navigating to Camera Network...')
    await clickNav('Camera Network')
    await page.screenshot({ path: path.join(screenshotDir, '08_camera_network.png') })

    // 9. Responsive Viewport (1024px)
    console.log('Testing 1024px responsive viewport...')
    await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 })
    await clickNav('Command Centre')
    await page.screenshot({ path: path.join(screenshotDir, '09_responsive_1024.png') })

    console.log('Headless testing completed successfully!')
    console.log('Total console/page errors detected:', errors.length)
  } catch (err) {
    console.error('Test execution failed:', err)
  } finally {
    await browser.close()
  }
}

runTests()
