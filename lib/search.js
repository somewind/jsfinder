/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author somewind https://github.com/somewind
*/
const path = require('path')
const os = require('os')
const fs = require('fs')

const CWD = process.cwd()
const LINE_BREAK_CHAR = os.platform() === 'win32' ? '\r\n' : '\n'

function listJSFiles (srcPath) {
  const files = fs.readdirSync(srcPath)
  const arr = []
  files.forEach(fileName => {
    const filePath = path.join(srcPath, fileName)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      arr.push(...listJSFiles(filePath))
    } else {
      if (filePath.endsWith('.js')) {
        arr.push(filePath)
      }
    }
  })
  return arr
}

function findWordInRow (row, rule) {
  let matches = []
  let currentMatch
  for (let i = 0; i < row.length; i++) {
    const m = row[i].match(rule)
    if (m && m.length !== 0) {
      if (!currentMatch) {
        currentMatch = {
          col: i,
          value: row[i]
        }
      } else {
        currentMatch.value += row[i]
      }
    } else {
      if (currentMatch) {
        matches.push(currentMatch)
      }
      currentMatch = null
    }
  }
  if (currentMatch) {
    matches.push(currentMatch)
  }
  return matches
}

function searchFile (filePath, rule) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const lines = fileContent.split(LINE_BREAK_CHAR)
  const fileMatches = []
  let lastCommentStart = false // like /*

  function lineMatchStart (row, line, index) {
    const subLine = line.substr(0, index)
    const matches = findWordInRow(subLine, rule)
    matches.forEach(match => {
      match.row = row
      fileMatches.push(match)
    })
  }

  function lineMatchEnd (row, line, index) {
    const subLine = line.substr(index)
    const matches = findWordInRow(subLine, rule)
    matches.forEach(match => {
      match.col += index
      match.row = row
      fileMatches.push(match)
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const inlineCommentStart = line.indexOf('//')
    if (inlineCommentStart !== -1) {
      // before //
      lineMatchStart(i, line, inlineCommentStart)
      continue
    }
    const commentStart = line.indexOf('/*')
    const commentEnd = line.indexOf('*/')
    if (lastCommentStart) {
      if (commentEnd === -1) {
        continue
      } else {
        // after */
        lastCommentStart = commentStart !== -1
        lineMatchEnd(i, line, commentEnd + 2)
      }
    } else {
      if (commentStart !== -1) {
        // before /*
        lineMatchStart(i, line, commentStart)

        // after */
        if (commentEnd !== -1) {
          lineMatchEnd(i, line, commentEnd + 2)
        } else {
          lastCommentStart = true
        }
      } else {
        const matches = findWordInRow(line, rule)
        matches.forEach(match => {
          match.row = i
          fileMatches.push(match)
        })
      }
    }
  }
  return fileMatches
}

function search (source, rule, printMatches) {
  const srcPath = path.join(CWD, source)
  const files = listJSFiles(srcPath)
  files.forEach(filePath => {
    let fileMatches = searchFile(filePath, rule)
    fileMatches.forEach(fm => {
      if (printMatches) {
        console.log(fm.value)
      } else {
        console.log(`${fm.value}(${filePath}:${fm.row + 1}:${fm.col + 1})`)
      }
    })
  })
}

module.exports = search
