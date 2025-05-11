import auth from './auth-router.js'
import lessons from './lesson-router.js'
import tests from './test-router.js'
import words from './word-router.js'
import expressions from './expression-router.js'
import wordFlashcards from './word-flashcard-router.js'
import report from './report-router.js'
import e from 'cors'
import domains from './domain-router.js'
export default{
    auth,
    lessons,
    tests,
    words,
    expressions,
    wordFlashcards,
    report,
    domains
}