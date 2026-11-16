import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function createCompliantOsPdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Introduction & 4 Necessary Conditions
  const page1 = pdfDoc.addPage([612, 792]);
  page1.drawText('OPERATING SYSTEMS - UNIT 3: DEADLOCKS', {
    x: 50,
    y: 720,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  page1.drawText('Page 1: Introduction, Definition, and the 4 Necessary Conditions', {
    x: 50,
    y: 690,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  const p1Lines = [
    'Definition of Deadlock:',
    'A deadlock is a situation in an operating system where a set of processes are blocked',
    'because each process holds at least one resource and is waiting for another resource',
    'that is currently being held by some other process in the set.',
    '',
    'The 4 Necessary Coffman Conditions (Must hold simultaneously):',
    '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.',
    '2. Hold and Wait: A process is holding at least one resource and waiting to acquire',
    '   additional resources currently held by other processes.',
    '3. No Preemption: Resources cannot be preempted; a resource can be released only',
    '   voluntarily by the process holding it after that process has finished its task.',
    '4. Circular Wait: A closed chain of processes exists such that each process holds',
    '   one or more resources that are needed by the next process in the chain.',
    '',
    'University Exam Note: All four conditions must hold simultaneously for a deadlock to occur.',
    'If we can invalidate even one of these four conditions, deadlock can be prevented.',
  ];

  let y = 650;
  for (const line of p1Lines) {
    page1.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 22;
  }

  // Page 2: Concrete Example & Resource Allocation Graph
  const page2 = pdfDoc.addPage([612, 792]);
  page2.drawText('Page 2: Concrete Example of Deadlock & Resource Allocation Graph', {
    x: 50,
    y: 720,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  const p2Lines = [
    'Concrete Example with Two Processes and Two Single-Instance Resources:',
    'Consider two active processes, Process P1 and Process P2, and two resources:',
    '  - Resource R1: Tape Drive',
    '  - Resource R2: Printer',
    '',
    'Execution Sequence leading to Deadlock:',
    '  - Step 1: Process P1 requests and is allocated Resource R1 (Tape Drive).',
    '  - Step 2: Process P2 requests and is allocated Resource R2 (Printer).',
    '  - Step 3: Process P1 requests Resource R2 (Printer). Since R2 is already held by P2,',
    '            Process P1 is blocked and placed into the waiting queue.',
    '  - Step 4: Simultaneously, Process P2 requests Resource R1 (Tape Drive). Since R1 is held',
    '            by Process P1, Process P2 is blocked and placed into the waiting queue.',
    '',
    'Result of the Execution:',
    '  - P1 is waiting for P2 to release the Printer.',
    '  - P2 is waiting for P1 to release the Tape Drive.',
    '  - Neither process can continue execution, nor can they release the resources they hold.',
    '  - This forms a circular wait! The system is in a complete DEADLOCK state.',
    '',
    'Resource Allocation Graph (RAG) Representation:',
    '  - Assignment Edges: R1 -> P1,  R2 -> P2',
    '  - Request Edges:    P1 -> R2,  P2 -> R1',
    '  - Directed Cycle:   P1 -> R2 -> P2 -> R1 -> P1',
  ];

  y = 680;
  for (const line of p2Lines) {
    page2.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 20;
  }

  // Page 3: Deadlock Avoidance and Bankers Algorithm
  const page3 = pdfDoc.addPage([612, 792]);
  page3.drawText('Page 3: Deadlock Avoidance and Bankers Algorithm', {
    x: 50,
    y: 720,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  const p3Lines = [
    'Deadlock Avoidance Concepts:',
    'Deadlock avoidance requires dynamic information concerning which resources each process',
    'will request during its execution. The system verifies if allocating a resource keeps',
    'the system in a SAFE STATE.',
    '',
    'Dijkstra\'s Banker\'s Algorithm:',
    'Applicable to systems with multiple instances of each resource type.',
    'Data Structures used:',
    '  - Available[m]: Vector of available instances of each resource type.',
    '  - Max[n][m]: Matrix defining maximum demand of each process.',
    '  - Allocation[n][m]: Matrix defining currently allocated resources to each process.',
    '  - Need[n][m]: Matrix defining remaining resource need of each process.',
    '',
    'Formula to Calculate Need Matrix:',
    '  Need[i][j] = Max[i][j] - Allocation[i][j]',
    '',
    'Safety Algorithm Summary:',
    '1. Let Work = Available, and Finish[i] = false for all processes.',
    '2. Find an index i such that Finish[i] == false and Need[i] <= Work.',
    '3. If such i exists, Work = Work + Allocation[i], Finish[i] = true, repeat step 2.',
    '4. If Finish[i] == true for all i, then the system is in a SAFE STATE.',
  ];

  y = 680;
  for (const line of p3Lines) {
    page3.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 21;
  }

  // Page 4: Deadlock Prevention, Detection, and Recovery
  const page4 = pdfDoc.addPage([612, 792]);
  page4.drawText('Page 4: Deadlock Prevention, Detection, and Recovery', {
    x: 50,
    y: 720,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.6),
  });

  const p4Lines = [
    'Deadlock Prevention Methods:',
    'Ensure that at least one of the four necessary conditions cannot hold:',
    '  - Invalidate Mutual Exclusion: Spooling or using shareable resources (read-only files).',
    '  - Invalidate Hold and Wait: Require process to request all resources at once.',
    '  - Invalidate No Preemption: Preempt held resources if a new request cannot be allocated.',
    '  - Invalidate Circular Wait: Impose a total linear ordering on all resource types F: R -> N.',
    '    A process can only request resource Rj if F(Rj) > F(Ri).',
    '',
    'Deadlock Detection and Recovery:',
    '  - Detection: Use Wait-For Graph (WFG) for single instances or Detection Algorithm for multiple instances.',
    '  - Recovery Options:',
    '      1. Process Termination: Abort all deadlocked processes, or abort one at a time until cycle breaks.',
    '      2. Resource Preemption: Successively preempt resources and rollback processes to a safe checkpoint.',
    '      3. Starvation Prevention: Ensure process is not picked as victim repeatedly by using cost metrics.',
  ];

  y = 680;
  for (const line of p4Lines) {
    page4.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
    y -= 21;
  }

  const pdfBytes = await pdfDoc.save();
  const dest = path.resolve('uploads', 'sample_os_unit3_deadlock.pdf');
  fs.writeFileSync(dest, pdfBytes);
  console.log('Successfully generated compliant PDF at:', dest);
}

createCompliantOsPdf().catch(console.error);
