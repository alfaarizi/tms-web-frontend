interface MossPlagiarism {
    type: 'moss';
    ignoreThreshold: number;
}

interface JPlagPlagiarism {
    type: 'jplag';
    tune: number;
}

export interface Plagiarism {
    id: number;
    semesterID: number;
    name: string;
    description: string;
    url: string | null;
    typeSpecificData: MossPlagiarism | JPlagPlagiarism;
}
