type LearningEntryProps = {
  topic: string;
  date: string;
  learned: string;
  confidence: number;
  personalthoughts: string;
};

function LearningEntry({ topic,date,learned,confidence,personalthoughts }: LearningEntryProps) {
  return (
    <article>
      <h2>{topic}</h2>
      <p>Date: {date}</p>
      <p>{learned}</p>
      <p>Confidence: {confidence} / 5</p>
      <p>{personalthoughts}</p>
    </article>
  );
}

export default LearningEntry;