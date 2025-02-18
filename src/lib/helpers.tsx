export const DescriptionWithHashtags = ({ text }: { text: string }) => {
  const parts = text.split(/(#\S+)/g);

  return (
    <p className="leading-relaxed">
      {parts.map((part, index) =>
        part.startsWith("#") ? (
          <span key={index} style={{ color: "#3b82f6", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};
