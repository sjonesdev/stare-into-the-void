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
    <div className="flex flex-wrap justify-evenly mt-5 3xl:text-3xl p-4 3xl:p-8">
      <div className="3xl:w-64">
        <img
          className="h-36 w-40 3xl:h-56 3xl:w-64 rounded-lg"
          alt={title}
          src={imgUrl}
        ></img>
        <p className="text-white text-center font-medium">{title}</p>
      </div>
      <div className="text-white w-64 3xl:w-80">
        <p className="font-medium text-center">{date}</p>
        {description.length > MAX_LENGTH ? (
          <div className="font-normal text-sm 3xl:text-xl text-clip">
            {`${description.substring(0, MAX_LENGTH).trim()}...`}
            <small>
              {" "}
              [<a href="/">Read more</a>]
            </small>
          </div>
        ) : (
          <p className="break-words font-normal text-sm 3xl:text-xl text-ellipsis overflow-hidden">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
