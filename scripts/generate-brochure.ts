import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

async function generateBrochure() {
  console.log('Starting Sampark Official Brochure generation...');

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('Sampark Car Tag Official Product Brochure');
  pdfDoc.setAuthor('Sampark Technologies - Delhi Hub');
  pdfDoc.setSubject('Official Brochure & Specification Sheet for Sampark Smart Vehicle Privacy Tag');
  pdfDoc.setKeywords(['Sampark', 'Car Tag', 'Smart QR', 'Privacy Tag', 'NGF132', 'Brochure']);

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Standard Poster / A4 Aspect Ratio: 1037 x 1600 points (matches Page 1 graphic)
  const PAGE_WIDTH = 1037;
  const PAGE_HEIGHT = 1600;

  // Colors
  const yellow = rgb(1, 0.902, 0); // #FFE600
  const yellowDark = rgb(0.96, 0.85, 0);
  const darkBg = rgb(0.08, 0.08, 0.08); // #141414
  const white = rgb(1, 1, 1);
  const offWhite = rgb(0.98, 0.98, 0.97); // #FAFAF8
  const grayText = rgb(0.4, 0.4, 0.4);
  const grayBorder = rgb(0.88, 0.88, 0.86);
  const cardBg = rgb(1, 1, 1);

  // ----------------------------------------------------
  // PAGE 1: Official Front Cover (The user's uploaded page 1)
  // ----------------------------------------------------
  console.log('Embedding Page 1 Cover...');
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Check if /tmp/hero_image.png exists, otherwise fetch it
  let heroImageBytes: Uint8Array;
  if (fs.existsSync('/tmp/hero_image.png')) {
    heroImageBytes = fs.readFileSync('/tmp/hero_image.png');
  } else {
    const res = await fetch('https://i.ibb.co/Qy1T0DT/image.png');
    heroImageBytes = new Uint8Array(await res.arrayBuffer());
  }

  const page1Image = await pdfDoc.embedPng(heroImageBytes);
  page1.drawImage(page1Image, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  // ----------------------------------------------------
  // PAGE 2: Comprehensive Specification & "How it works?"
  // ----------------------------------------------------
  console.log('Building Page 2 Specification & Flow...');
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Background
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: offWhite,
  });

  // 1. Top Header Yellow Banner
  page2.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 260,
    width: PAGE_WIDTH,
    height: 260,
    color: yellow,
  });

  // Header Title & Subtitle
  page2.drawText('A car with civic sense.', {
    x: 50,
    y: PAGE_HEIGHT - 110,
    size: 48,
    font: helveticaBold,
    color: darkBg,
  });

  page2.drawText('Allow people to reach you in case of any issues with your parked car.', {
    x: 50,
    y: PAGE_HEIGHT - 165,
    size: 22,
    font: helvetica,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Top Right: Sampark Brand & Tag Preview
  page2.drawRectangle({
    x: PAGE_WIDTH - 300,
    y: PAGE_HEIGHT - 230,
    width: 250,
    height: 200,
    color: white,
    borderColor: darkBg,
    borderWidth: 2,
  });

  page2.drawText('SAMPARK', {
    x: PAGE_WIDTH - 275,
    y: PAGE_HEIGHT - 65,
    size: 26,
    font: helveticaBold,
    color: darkBg,
  });

  page2.drawText('Scan the code to contact', {
    x: PAGE_WIDTH - 275,
    y: PAGE_HEIGHT - 95,
    size: 14,
    font: helveticaBold,
    color: darkBg,
  });

  page2.drawText('the vehicle owner', {
    x: PAGE_WIDTH - 275,
    y: PAGE_HEIGHT - 115,
    size: 14,
    font: helveticaBold,
    color: darkBg,
  });

  // QR Code for Tag Preview
  const tagQrPng = await QRCode.toBuffer('https://sampark.me/contact?tag=official-brochure', {
    width: 90,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });
  const embeddedTagQr = await pdfDoc.embedPng(tagQrPng);
  page2.drawImage(embeddedTagQr, {
    x: PAGE_WIDTH - 150,
    y: PAGE_HEIGHT - 215,
    width: 80,
    height: 80,
  });

  page2.drawText('Wrong Parking | Emergency', {
    x: PAGE_WIDTH - 280,
    y: PAGE_HEIGHT - 160,
    size: 10,
    font: helvetica,
    color: grayText,
  });
  page2.drawText('Safe & 100% Masked Call', {
    x: PAGE_WIDTH - 280,
    y: PAGE_HEIGHT - 180,
    size: 10,
    font: helveticaBold,
    color: darkBg,
  });

  // ----------------------------------------------------
  // SECTION 1: How it works?
  // ----------------------------------------------------
  const section1Y = PAGE_HEIGHT - 320;

  // Section 1 Badge
  page2.drawRectangle({
    x: 50,
    y: section1Y,
    width: 260,
    height: 48,
    color: yellow,
    borderWidth: 0,
  });
  page2.drawText('How it works?', {
    x: 75,
    y: section1Y + 14,
    size: 26,
    font: helveticaBold,
    color: darkBg,
  });

  // 4 Steps Cards Grid
  const steps = [
    {
      num: '1',
      title: 'Stick the tag',
      desc: 'Place the durable waterproof Sampark tag on your car windscreen inside or outside.',
      sub: 'Zero battery, zero maintenance.',
    },
    {
      num: '2',
      title: 'Someone scans',
      desc: "If there's any issue with your parked car, bystander or security scans the QR code with any phone.",
      sub: 'No special app required to scan.',
    },
    {
      num: '3',
      title: 'They reach you',
      desc: 'They tap to call or message you. Voice calls route through NGF132 private masked cloud lines.',
      sub: 'Masked Call | SMS | WhatsApp',
    },
    {
      num: '4',
      title: 'You stay informed',
      desc: 'You receive the call and resolve the parking issue instantly while your phone number stays 100% private.',
      sub: 'Safe | Anonymous | Immediate',
    },
  ];

  const cardWidth = 445;
  const cardHeight = 220;
  const gridPositions = [
    { x: 50, y: section1Y - 260 },
    { x: 540, y: section1Y - 260 },
    { x: 50, y: section1Y - 510 },
    { x: 540, y: section1Y - 510 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const pos = gridPositions[i];

    // Card background
    page2.drawRectangle({
      x: pos.x,
      y: pos.y,
      width: cardWidth,
      height: cardHeight,
      color: white,
      borderColor: grayBorder,
      borderWidth: 1.5,
    });

    // Step Number Yellow Circle
    page2.drawCircle({
      x: pos.x + 40,
      y: pos.y + cardHeight - 45,
      size: 24,
      color: yellow,
    });
    page2.drawText(s.num, {
      x: pos.x + 33,
      y: pos.y + cardHeight - 53,
      size: 22,
      font: helveticaBold,
      color: darkBg,
    });

    // Step Title
    page2.drawText(s.title, {
      x: pos.x + 80,
      y: pos.y + cardHeight - 52,
      size: 24,
      font: helveticaBold,
      color: darkBg,
    });

    // Step Description
    const words = s.desc.split(' ');
    let line1 = '';
    let line2 = '';
    for (const w of words) {
      if ((line1 + ' ' + w).length < 38) {
        line1 += (line1 ? ' ' : '') + w;
      } else {
        line2 += (line2 ? ' ' : '') + w;
      }
    }

    page2.drawText(line1, {
      x: pos.x + 30,
      y: pos.y + cardHeight - 105,
      size: 16,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    });

    if (line2) {
      page2.drawText(line2, {
        x: pos.x + 30,
        y: pos.y + cardHeight - 130,
        size: 16,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    // Step Sub-label pill
    page2.drawRectangle({
      x: pos.x + 30,
      y: pos.y + 25,
      width: cardWidth - 60,
      height: 36,
      color: offWhite,
      borderColor: grayBorder,
      borderWidth: 1,
    });

    page2.drawText(s.sub, {
      x: pos.x + 45,
      y: pos.y + 36,
      size: 13,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  // ----------------------------------------------------
  // SECTION 2: Why Sampark?
  // ----------------------------------------------------
  const section2Y = section1Y - 600;

  // Section 2 Badge
  page2.drawRectangle({
    x: 50,
    y: section2Y,
    width: 250,
    height: 48,
    color: yellow,
  });
  page2.drawText('Why Sampark?', {
    x: 75,
    y: section2Y + 14,
    size: 26,
    font: helveticaBold,
    color: darkBg,
  });

  const benefits = [
    {
      title: 'Privacy First',
      desc: 'Your mobile number is never exposed to strangers, towing staff, or bystanders.',
      tag: '100% Encrypted VoIP',
    },
    {
      title: 'Helpful Community',
      desc: 'Makes parking courteous and safer. Reduces towing, vandalism, and traffic jams.',
      tag: 'Civic Respect',
    },
    {
      title: 'Fewer Hassles',
      desc: 'Get notified immediately about accidental bumps, flat tires, or headlights left on.',
      tag: 'Instant Alerts',
    },
    {
      title: 'A Kinder City',
      desc: 'Small considerate actions build safer neighborhoods across Indian cities.',
      tag: 'Built for India',
    },
  ];

  const benWidth = 215;
  const benHeight = 250;
  const benSpacing = 25;

  for (let i = 0; i < benefits.length; i++) {
    const b = benefits[i];
    const bx = 50 + i * (benWidth + benSpacing);
    const by = section2Y - 280;

    // Benefit Card
    page2.drawRectangle({
      x: bx,
      y: by,
      width: benWidth,
      height: benHeight,
      color: white,
      borderColor: grayBorder,
      borderWidth: 1.5,
    });

    // Yellow Accent Circle
    page2.drawCircle({
      x: bx + benWidth / 2,
      y: by + benHeight - 45,
      size: 26,
      color: yellow,
    });

    // Vector checkmark lines inside circle
    page2.drawLine({
      start: { x: bx + benWidth / 2 - 9, y: by + benHeight - 45 },
      end: { x: bx + benWidth / 2 - 2, y: by + benHeight - 52 },
      thickness: 3.5,
      color: darkBg,
    });
    page2.drawLine({
      start: { x: bx + benWidth / 2 - 2, y: by + benHeight - 52 },
      end: { x: bx + benWidth / 2 + 10, y: by + benHeight - 38 },
      thickness: 3.5,
      color: darkBg,
    });

    // Title
    page2.drawText(b.title, {
      x: bx + 15,
      y: by + benHeight - 95,
      size: 18,
      font: helveticaBold,
      color: darkBg,
    });

    // Description
    const bWords = b.desc.split(' ');
    let bLine1 = '';
    let bLine2 = '';
    let bLine3 = '';
    for (const w of bWords) {
      if ((bLine1 + ' ' + w).length < 20) {
        bLine1 += (bLine1 ? ' ' : '') + w;
      } else if ((bLine2 + ' ' + w).length < 20) {
        bLine2 += (bLine2 ? ' ' : '') + w;
      } else {
        bLine3 += (bLine3 ? ' ' : '') + w;
      }
    }

    page2.drawText(bLine1, {
      x: bx + 15,
      y: by + benHeight - 130,
      size: 13,
      font: helvetica,
      color: rgb(0.25, 0.25, 0.25),
    });
    if (bLine2) {
      page2.drawText(bLine2, {
        x: bx + 15,
        y: by + benHeight - 150,
        size: 13,
        font: helvetica,
        color: rgb(0.25, 0.25, 0.25),
      });
    }
    if (bLine3) {
      page2.drawText(bLine3, {
        x: bx + 15,
        y: by + benHeight - 170,
        size: 13,
        font: helvetica,
        color: rgb(0.25, 0.25, 0.25),
      });
    }

    // Tag Pill
    page2.drawRectangle({
      x: bx + 15,
      y: by + 20,
      width: benWidth - 30,
      height: 30,
      color: offWhite,
      borderColor: grayBorder,
      borderWidth: 1,
    });

    page2.drawText(b.tag, {
      x: bx + 25,
      y: by + 29,
      size: 11,
      font: helveticaBold,
      color: darkBg,
    });
  }

  // ----------------------------------------------------
  // SECTION 3: Bottom Trust Banner & Official Contact Pill
  // ----------------------------------------------------
  const bottomY = 160;

  // Slogan & Brand
  page2.drawText('Park Better Together', {
    x: 60,
    y: bottomY + 70,
    size: 38,
    font: helveticaBold,
    color: darkBg,
  });

  page2.drawText('REAL PEOPLE. REAL SOLUTIONS. SAFER STREETS.', {
    x: 60,
    y: bottomY + 35,
    size: 18,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Bottom Full Width Contact Yellow Banner
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: 120,
    color: yellow,
  });

  page2.drawText('Call: +91 84477 77948', {
    x: 60,
    y: 45,
    size: 44,
    font: helveticaBold,
    color: darkBg,
  });

  page2.drawText('Official Website: https://sampark.me  |  Delhi Hub, Narela 110040', {
    x: 60,
    y: 18,
    size: 16,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Bottom Right QR Code
  const footerQrPng = await QRCode.toBuffer('https://sampark.me', {
    width: 95,
    margin: 1,
    color: { dark: '#000000', light: '#FFE600' },
  });
  const embeddedFooterQr = await pdfDoc.embedPng(footerQrPng);
  page2.drawImage(embeddedFooterQr, {
    x: PAGE_WIDTH - 150,
    y: 12,
    width: 96,
    height: 96,
  });

  // Write the PDF file to public/sampark-official-brochure.pdf
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'sampark-official-brochure.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`Brochure successfully generated at: ${outputPath} (${pdfBytes.length} bytes)`);

  // Also copy to dist/ if dist exists
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sampark-official-brochure.pdf'), pdfBytes);
  }
}

generateBrochure().catch((err) => {
  console.error('Error generating brochure:', err);
  process.exit(1);
});
