'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

type Gender = 'male' | 'female'

type ColorKey = 'blue' | 'green' | 'yellow' | 'red'

const colorMap: Record<ColorKey, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
}

function getCategory(bmi: number, lang: string): { label: string; color: ColorKey } {
  if (bmi < 18.5) return { label: lang === 'ja' ? '低体重（痩せ型）' : 'Underweight', color: 'blue' }
  if (bmi < 25) return { label: lang === 'ja' ? '普通体重' : 'Normal', color: 'green' }
  if (bmi < 30) return { label: lang === 'ja' ? '肥満（1度）' : 'Overweight', color: 'yellow' }
  return { label: lang === 'ja' ? '肥満（2度以上）' : 'Obese', color: 'red' }
}

export default function Home() {
  const { t, lang } = useI18n()
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')

  const h = parseFloat(height)
  const w = parseFloat(weight)
  const a = parseInt(age)

  const isValid = h >= 100 && h <= 250 && w >= 20 && w <= 300

  const bmi = isValid ? w / Math.pow(h / 100, 2) : 0
  const category = isValid ? getCategory(bmi, lang) : null
  const cc = category ? colorMap[category.color] : null

  const idealMin = isValid ? Math.round(18.5 * Math.pow(h / 100, 2) * 10) / 10 : 0
  const idealMax = isValid ? Math.round(24.9 * Math.pow(h / 100, 2) * 10) / 10 : 0
  const idealBest = isValid ? Math.round(22 * Math.pow(h / 100, 2) * 10) / 10 : 0

  let bmr = 0
  if (isValid && a >= 15 && a <= 100) {
    bmr = gender === 'male'
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a
  }
  const tdee = bmr > 0 ? Math.round(bmr * 1.55) : 0

  const bmiPos = isValid ? Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100)) : 0

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t.appName}</h1>
        <p className="text-base text-gray-500">{t.tagline}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {lang === 'ja' ? '身長 (cm)' : 'Height (cm)'}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="170"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {lang === 'ja' ? '体重 (kg)' : 'Weight (kg)'}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="65"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {lang === 'ja' ? '年齢' : 'Age'}
              <span className="text-xs text-gray-400 ml-1">{lang === 'ja' ? '(任意)' : '(optional)'}</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="30"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {lang === 'ja' ? '性別' : 'Gender'}
            </label>
            <div className="flex gap-2">
              {(['male', 'female'] as Gender[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 min-h-[44px] rounded-lg text-sm font-medium border transition-colors ${gender === g ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                >
                  {g === 'male' ? (lang === 'ja' ? '男性' : 'Male') : (lang === 'ja' ? '女性' : 'Female')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isValid && category && cc ? (
        <div className={`rounded-xl border-2 p-6 ${cc.bg} ${cc.border}`}>
          <div className="text-center mb-5">
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${cc.text}`}>BMI</div>
            <div className={`text-6xl font-bold tabular-nums ${cc.text}`}>{bmi.toFixed(1)}</div>
            <div className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-bold ${cc.badge}`}>
              {category.label}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/70 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-0.5">
                {lang === 'ja' ? '適正体重（BMI 22）' : 'Ideal Weight (BMI 22)'}
              </div>
              <div className="text-lg font-bold text-gray-800">
                {idealBest} kg
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({idealMin}〜{idealMax} kg)
                </span>
              </div>
            </div>
            {tdee > 0 && (
              <div className="bg-white/70 rounded-lg px-4 py-3">
                <div className="text-xs text-gray-500 mb-0.5">
                  {lang === 'ja' ? '1日の消費カロリー目安（普通の活動量）' : 'Daily Calorie Need (moderate activity)'}
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {tdee.toLocaleString()} kcal
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="relative h-3 rounded-full overflow-hidden flex">
              <div className="bg-blue-400" style={{ width: '14%' }} />
              <div className="bg-green-400" style={{ width: '26%' }} />
              <div className="bg-yellow-400" style={{ width: '20%' }} />
              <div className="bg-red-400" style={{ width: '40%' }} />
              <div
                className="absolute top-0 bottom-0 w-1 bg-gray-900 rounded-full"
                style={{ left: `calc(${bmiPos}% - 2px)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>
      ) : (height || weight) ? (
        <p className="text-center text-sm text-amber-600">
          {lang === 'ja' ? '身長100〜250cm、体重20〜300kgの範囲で入力してください' : 'Please enter height 100-250cm, weight 20-300kg'}
        </p>
      ) : (
        <p className="text-center text-sm text-gray-400">
          {lang === 'ja' ? '身長と体重を入力してください' : 'Enter your height and weight'}
        </p>
      )}
    </main>
  )
}
