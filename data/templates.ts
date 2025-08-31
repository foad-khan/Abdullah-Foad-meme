export interface MemeTemplate {
  id: string;
  name: string;
  src: string;
}

export const templates: MemeTemplate[] = [
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    src: 'https://i.imgur.com/v28hG1R.jpg',
  },
  {
    id: 'drake-hotline-bling',
    name: 'Drake Hotline Bling',
    src: 'https://i.imgur.com/I76r41a.jpg',
  },
  {
    id: 'woman-yelling-at-cat',
    name: 'Woman Yelling at a Cat',
    src: 'https://i.imgur.com/3c89f5k.jpg',
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    src: 'https://i.imgur.com/NVIhV4I.jpg',
  },
];
