import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.trim());
type NodeType = 'file' | 'directory';
class Root {
 directories: Dir[] = [];
 files: File[] = [];
 readonly isRoot = true as const;
 totalSize: null | number = null;

 getTotalSize(): number {
  if (this.totalSize != null) return this.totalSize;
  this.totalSize = 0;
  for (const dir of this.directories) {
    this.totalSize += dir.setTotalSize();
  }
  for (const file of this.files) {
    this.totalSize += file.size;
  }
  return this.totalSize;
 }
}
class Node {
  parent: Root | Dir;
  type: NodeType;

  constructor(parent: Root | Dir, type: NodeType) {
    this.parent = parent;
    this.type = type;
  }
}
class File extends Node {
  size: number;
  extension: string | null;
  name: string;
  type = 'file' as const;

  constructor(parent: Root | Dir, size: number, name: string, extension: string | null) {
    super(parent, 'file');
    this.size = size;
    this.name = name;
    this.extension = extension;
  }
}
class Dir extends Node {
  directories: Dir[] = [];
  files: File[] = [];
  type = 'directory' as const;
  name: string;
  readonly isRoot = false as const;
  totalSize: null | number = null;

  constructor(parent: Root | Dir, name: string) {
    super(parent, 'directory');
    this.name = name;
  }

  findChildDirs(maxSize = 100000) {
    console.log(`Checking dir: ${this.name}`);
    const arr: Dir[] = [];
    for (const dir of this.directories) {
      if (dir.setTotalSize() <= maxSize) {
        arr.push(dir);
      }
      arr.push(...dir.findChildDirs(maxSize));
    }
    return arr;
  }

  setTotalSize(): number {
    if (this.totalSize != null) return this.totalSize;

    const fileSizeCombined = this.files.reduce((acc, val) => acc + val.size, 0);
    let dirTotal = 0;

    for (const childDir of this.directories) {
      dirTotal += childDir.setTotalSize();
    }
    this.totalSize = dirTotal + fileSizeCombined;
    return this.totalSize;
  }

  addChildren(children: Node[]) {
    for (const child of children) {
      if (child.type === 'directory') {
        this.directories.push(child as Dir);
      } else if (child.type === 'file') {
        this.files.push(child as File);
      }
    }
    return this;
  }
  addDir(dir: Dir) {
    this.directories.push(dir);
    return this;
  }
  addFile(file: File) {
    this.files.push(file);
    return this;
  }
  addChild(fileOrDir: File | Dir) {
    if (fileOrDir.type === 'directory') {
      this.addDir(fileOrDir);
    } else if (fileOrDir.type === 'file') {
      this.addFile(fileOrDir);
    }
    return this;
  }
}

function isRootDir(dir: Dir | Root): dir is Root {
  return !!dir.isRoot;
}
function isDirDir(dir: Dir | Root): dir is Dir {
  return !dir.isRoot;
}

type GoToCmd = { dirName: string, cmd: 'goto' };
type GoToRootCmd = { dirName: '/', cmd: 'gotoRoot' };
type ListCmd = { cmd: 'list' };
type Cmd = GoToCmd | ListCmd | GoToRootCmd;

const parseCmd = (line: string): Cmd => {
  if (line.startsWith('$ cd /')) {
    return { dirName: '/', cmd: 'gotoRoot' } as GoToRootCmd;
  } else if (line.startsWith('$ cd')) {
    const [_a, _b, dirName] = line.split(' ');
    return { dirName, cmd: 'goto' } as GoToCmd;
  } else if (line.startsWith('$ ls')) {
    return { cmd: 'list' };
  } else {
    throw new Error('Unknown command');
  }
}
const parseDir = (line: string, currentDir: Dir | Root) => {
  if (!line.startsWith('dir')) throw new Error('not a dir');
  const [_a, dirName] = line.split(' ');
  return new Dir(currentDir, dirName);
}
const parseFile = (line: string, currentDir: Dir | Root) => {
  const [fileSizeStr, fileNameFull] = line.split(' ');
  const fileSize = +fileSizeStr;
  if (fileNameFull.includes('.')) {
    const [name, ext] = fileNameFull.split('.');
    return new File(currentDir, fileSize, name, ext);
  } else {
    return new File(currentDir, fileSize, fileNameFull, null);
  }
}
const parseLine = (line: string, currentDir: Dir | Root) => {
  if (line.startsWith('$')) {
    return parseCmd(line);
  } else if (line.startsWith('dir')) {
    return parseDir(line, currentDir);
  } else {
    return parseFile(line, currentDir);
  }
}

function dirTreeBuilder(lines: string[]) {
  const root = new Root();
  let currentDir: Root | Dir = root;

  for (const line of lines) {
    const parsed = parseLine(line, currentDir);
    if ('cmd' in parsed) {
      if (parsed.cmd === 'list') continue;
      if (parsed.cmd === 'gotoRoot') {
        currentDir = root;
        continue;
      }
      if (parsed.cmd === 'goto') {
        if (parsed.dirName === '..') {
          const next: Dir | Root = (currentDir as unknown as Dir).parent;
          currentDir = next;
          continue;
        } else {
          const name = parsed.dirName;
          const next: Dir = currentDir.directories.find(d => d.name === name)!;
          currentDir = next;
          continue;
        }        
      }
    } else if (parsed.type === 'directory') {
      if (isDirDir(currentDir)) {
        currentDir.addDir(parsed);
        continue;
      } else if (isRootDir(currentDir)) {
        currentDir.directories.push(parsed);
        continue;
      }
    } else if (parsed.type === 'file') {
      if (isDirDir(currentDir)) {
        currentDir.addFile(parsed);
      } else {
        currentDir.files.push(parsed);
      }
      continue;
    }
  }
  return root;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const root = dirTreeBuilder(input);
  const totalSize = root.getTotalSize();
  console.log(totalSize);

  const targetDirs: Dir[] = [];
  for (const dir of root.directories) {
    if (dir.setTotalSize() <= 100000) {
      targetDirs.push(dir);
    }
    targetDirs.push(...dir.findChildDirs(100000));
  }
  return targetDirs.reduce((acc, val) => acc + val.setTotalSize(), 0);

  
  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  
  return;
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
