import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    // Keep original extension
    const ext = file.name.split('.').pop() || 'bin'
    const filename = `${uniqueSuffix}.${ext}`
    
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore directory exists error
    }

    const path = join(uploadDir, filename)
    await writeFile(path, buffer)

    return NextResponse.json({ 
      url: `/uploads/${filename}`, 
      type: file.type 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
