import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

// Use public DNS resolvers to handle SRV record lookups
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import CodingQuestion from "./src/models/codingQuestion.model.js";

const questions = [
  {
    title: "Merge k Sorted Lists",
    description: `<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>
<p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>

<p><strong>Example 1:</strong></p>
<pre>
<strong>Input:</strong> lists = [[1,4,5],[1,3,4],[2,6]]
<strong>Output:</strong> [1,1,2,3,4,4,5,6]
<strong>Explanation:</strong> The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
</pre>`,
    category: "Linked List",
    difficulty: "Hard",
    status: "published",
    acceptanceRate: 43,
    tags: ["Linked List", "Divide and Conquer", "Heap (Priority Queue)", "Merge Sort"],
    companies: ["Google", "Microsoft", "Amazon", "Facebook"],
    constraints: "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4",
    starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
    // Write your JavaScript code here
}`
  },
  {
    title: "Edit Distance",
    description: `<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.</p>
<p>You have the following three operations permitted on a word:</p>
<ul>
  <li>Insert a character</li>
  <li>Delete a character</li>
  <li>Replace a character</li>
</ul>

<p><strong>Example 1:</strong></p>
<pre>
<strong>Input:</strong> word1 = "horse", word2 = "ros"
<strong>Output:</strong> 3
<strong>Explanation:</strong> 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
</pre>`,
    category: "Dynamic Programming",
    difficulty: "Hard",
    status: "published",
    acceptanceRate: 55,
    tags: ["String", "Dynamic Programming"],
    companies: ["Google", "Microsoft", "Amazon"],
    constraints: "0 <= word1.length, word2.length <= 500\nword1 and word2 consist of lowercase English letters.",
    starterCode: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
function minDistance(word1, word2) {
    // Write your JavaScript code here
}`
  },
  {
    title: "Longest Palindromic Substring",
    description: `<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>

<p><strong>Example 1:</strong></p>
<pre>
<strong>Input:</strong> s = "babad"
<strong>Output:</strong> "bab"
<strong>Explanation:</strong> "aba" is also a valid answer.
</pre>

<p><strong>Example 2:</strong></p>
<pre>
<strong>Input:</strong> s = "cbbd"
<strong>Output:</strong> "bb"
</pre>`,
    category: "Strings",
    difficulty: "Medium",
    status: "published",
    acceptanceRate: 33,
    tags: ["String", "Dynamic Programming"],
    companies: ["Microsoft", "Google", "Amazon", "Adobe"],
    constraints: "1 <= s.length <= 1000\ns consist of only digits and English letters.",
    starterCode: `/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
    // Write your JavaScript code here
}`
  },
  {
    title: "Binary Tree Maximum Path Sum",
    description: `<p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.</p>
<p>The <strong>path sum</strong> of a path is the sum of the node's values in the path.</p>
<p>Given the <code>root</code> of a binary tree, return <em>the maximum path sum of any non-empty path</em>.</p>

<p><strong>Example 1:</strong></p>
<pre>
<strong>Input:</strong> root = [1,2,3]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.
</pre>`,
    category: "Trees",
    difficulty: "Hard",
    status: "published",
    acceptanceRate: 39,
    tags: ["Tree", "Depth-First Search", "Binary Tree", "Dynamic Programming"],
    companies: ["Google", "Microsoft", "Facebook"],
    constraints: "The number of nodes in the tree is in the range [1, 3 * 10^4].\n-1000 <= Node.val <= 1000",
    starterCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxPathSum(root) {
    // Write your JavaScript code here
}`
  },
  {
    title: "Course Schedule II",
    description: `<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [ai, bi]</code> indicates that you <strong>must</strong> take course <code>bi</code> first if you want to take course <code>ai</code>.</p>
<p>Return <em>the ordering of courses you should take to finish all courses</em>. If there are many valid answers, return <strong>any</strong> of them. If it is impossible to finish all courses, return <strong>an empty array</strong>.</p>

<p><strong>Example 1:</strong></p>
<pre>
<strong>Input:</strong> numCourses = 2, prerequisites = [[1,0]]
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].
</pre>`,
    category: "Graphs",
    difficulty: "Medium",
    status: "published",
    acceptanceRate: 49,
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    companies: ["Google", "Microsoft", "Amazon", "Uber"],
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= numCourses * (numCourses - 1)\nprerequisites[i].length == 2\n0 <= ai, bi < numCourses\nai != bi\nAll the pairs [ai, bi] are distinct.",
    starterCode: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
function findOrder(numCourses, prerequisites) {
    // Write your JavaScript code here
}`
  }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI environment variable is missing.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    for (const q of questions) {
      const existing = await CodingQuestion.findOne({ title: q.title });
      if (existing) {
        console.log(`Question "${q.title}" already exists, skipping.`);
      } else {
        await CodingQuestion.create(q);
        console.log(`Created question: "${q.title}"`);
      }
    }

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
