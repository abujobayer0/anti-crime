const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="w-full backdrop-blur-xl rounded-3xl p-12 text-center border border-border/10 bg-gradient-to-b from-card/50 to-card/30">
    <div className="mx-auto space-y-6">
      <div className="text-primary mx-auto opacity-60 w-fit">{icon}</div>
      <h4 className="text-2xl font-bold text-muted-foreground">{title}</h4>
      <p className="text-muted-foreground/80 text-lg max-w-md mx-auto">
        {description}
      </p>
    </div>
  </div>
);

export default EmptyState;
