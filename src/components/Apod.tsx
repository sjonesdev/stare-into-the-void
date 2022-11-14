const MAX_LENGTH = 260;

interface ApodProps {
  imgUrl: string;
  date: string;
  title: string;
  description: string;
}

export default function Apod({
  imgUrl,
  date,
  title,
  description, //260 max char
}: ApodProps) {
  return (
    <div className="flex flex-wrap justify-evenly mt-5">
      <div>
        <img className="h-36 w-40 rounded-lg" alt={title} src={imgUrl}></img>
        <p className="text-white font-medium">{title}</p>
      </div>
      <div className="text-white w-64">
        <p className="font-medium pl-12">{date}</p>
        {description.length > MAX_LENGTH ? (
          <div className="font-normal text-sm text-clip">
            {`${description.substring(0, MAX_LENGTH)}...`}
            <a href="/">Read more</a>
          </div>
        ) : (
          <p className="break-words font-normal text-sm text-ellipsis overflow-hidden">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
